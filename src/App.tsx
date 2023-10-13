import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Comment from "./model/Comment";
import { useDatabase, withObservables } from "@nozbe/watermelondb/react";
import Post from "./model/Post";
import { Query } from "@nozbe/watermelondb";

function App() {
  const [post, setPost] = useState<Post | null>(null);
  const database = useDatabase();

  async function createPost() {
    await database.write(async () => {
      const newPost = await database.get<Post>("posts").create((post) => {
        (post.title = "New post"), (post.body = "Lorem ipsum...");
      });

      setPost(newPost);
    });
  }

  useEffect(() => {
    async function init() {
      const collection = database.get<Post>("posts");
      // get the first record
      collection
        .query()
        .observe()
        .subscribe((posts) => {
          setPost(posts[0]);
        });
    }
    init();
  }, []);

  if (!post) {
    return <button onClick={createPost}>Create Post</button>;
  }

  return <EnhancedPost post={post} />;
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

const PostItem: React.FC<{ post: Post; comments: Comment[] }> = ({
  post,
  comments,
}) => (
  <article>
    <h1>{post.title}</h1>
    <p>{post.body}</p>
    <h2>Comments</h2>
    {comments.map((comment) => (
      <EnhancedComment key={comment.id} comment={comment} />
    ))}
  </article>
);

const enhancePost = withObservables<
  { post: Post },
  { post: Post; comments: Query<Comment> }
>(["post"], ({ post }) => ({
  post,
  comments: post.comments, // Shortcut syntax for `post.comments.observe()`
}));

const EnhancedPost = enhancePost(PostItem);
