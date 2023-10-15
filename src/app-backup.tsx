import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Comment from "./model/Comment";
import { useDatabase, withObservables } from "@nozbe/watermelondb/react";
import Post from "./model/Post";
import { Query } from "@nozbe/watermelondb";
import { Observable } from "@nozbe/watermelondb/utils/rx";

function App() {
  // const [post, setPost] = useState<Post | null>(null);

  const database = useDatabase();
  const posts = useObservable(
    database.collections.get<Post>("posts").query().observe(),
    []
  );

  async function createPost() {
    await database.write(async () => {
      const newPost = await database.get<Post>("posts").create((post) => {
        (post.title = "New post"), (post.body = "Lorem ipsum...");
      });

      // setPost(newPost);
    });
  }

  // useEffect(() => {
  //   async function init() {
  //     const collection = database.get<Post>("posts");
  //     // get the first record. there must be a better way to do this though
  //     collection
  //       .query()
  //       .observe()
  //       .subscribe((posts) => {
  //         setPost(posts[0]);
  //       });
  //   }
  //   init();
  // }, []);

  return (
    <div>
      <h1>Posts</h1>
      {posts.map((post) => (
        <EnhancedPost key={post.id} post={post} />
      ))}
      <button onClick={createPost}>Create Post</button>
    </div>
  );

  // if (!post) {
  // return <button onClick={createPost}>Create Post</button>;
  // }

  // return <EnhancedPost post={post} />;
}

export default App;

const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => (
  <div>
    <p>{comment.body}</p>
  </div>
);

const enhanceComment = withObservables(["comment"], ({ comment }) => ({
  comment,
}));

const EnhancedComment = enhanceComment(CommentItem);

const PostItem: React.FC<{ post: Post }> = ({ post: post$ }) => {
  const database = useDatabase();
  const post = useObservable(post$.observe(), post$);
  const comments = useObservable(post$.comments.observe(), []);

  console.log({ post, comments });

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
      <h2>Comments</h2>
      {comments.map((comment) => (
        <EnhancedComment key={comment.id} comment={comment} />
      ))}

      {/* delete post button */}
      <button
        onClick={async () => {
          database.write(async () => {
            await post.markAsDeleted(); // syncable
          });
        }}
      >
        Delete Post
      </button>

      {/* add comment button */}
      <button
        onClick={async () => {
          await post.addComment("test comment" + Math.random());
        }}
      >
        Add Comment
      </button>
    </article>
  );
};

// const enhancePost = withObservables<
//   { post: Post },
//   { post: Post; comments: Query<Comment> }
// >(["post"], ({ post }) => ({
//   post,
//   comments: post.comments, // Shortcut syntax for `post.comments.observe()`
// }));

// const EnhancedPost = enhancePost(PostItem);
const EnhancedPost = PostItem;

function useObservable(
  observable: Observable,
  initial?: any,
  deps: any[] = []
) {
  const [state, setState] = useState(initial);

  useEffect(() => {
    const subscription = observable.subscribe(setState);
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
