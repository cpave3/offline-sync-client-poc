import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Comment from "./model/Comment";
import { useDatabase, withObservables } from "@nozbe/watermelondb/react";
import Post from "./model/Post";
import { Query } from "@nozbe/watermelondb";
import { Observable } from "@nozbe/watermelondb/utils/rx";
import Task from "./model/Task";
import TaskInspection from "./model/TaskInspection";
import { mySync } from "./sync";

function App() {
  // const [post, setPost] = useState<Post | null>(null);

  const database = useDatabase();
  const tasks = useObservable(
    database.collections.get<Task>("tasks").query().observe(),
    []
  );

  async function createTask() {
    await database.write(async () => {
      const task = await database.get<Task>("tasks").create((task) => {
        (task.summary = "New post"), (task.description = "Lorem ipsum...");
      });

      await database
        .get<TaskInspection>("task_inspections")
        .create((taskInspection) => {
          taskInspection.task.set(task);
          taskInspection.agreementEndDate = new Date().toDateString();
        });
    });
  }

  console.log({ tasks });

  return (
    <div>
      <h1>Tasks</h1>
      {tasks.map((task) => (
        <EnhancedTask key={task.id} task={task} />
      ))}
      <br />
      {/* green button with tailwind */}
      <button onClick={createTask}>Create Task</button>
      {/* reset database */}
      {/* <button
        onClick={async () => {
          await database.write(async () => {
            await database.unsafeResetDatabase();
          });
        }}
      >
        Reset DB
      </button> */}
      {/* sync button */}
      <button
        onClick={async () => {
          await mySync(database);
        }}
      >
        Sync
      </button>
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

const TaskItem: React.FC<{ task: Task }> = ({ task: task$ }) => {
  const database = useDatabase();
  const task = useObservable(task$?.observe(), task$);
  // const comments = useObservable(task$.comments.observe(), []);
  const taskInspections$ = useObservable(
    task.taskInspectionQuery.observe(),
    []
  );

  // need to get the first task inspection result
  const [taskInspection, setTaskInspection] = useState<TaskInspection | null>(
    null
  );
  useEffect(() => {
    setTaskInspection(taskInspections$[0]);
  }, [taskInspections$]);

  const rooms = useObservable(
    taskInspection?.rooms.observe(),
    [],
    [taskInspection] // getting kind of scary, but without proper 1:1 relationship, this works
  );

  // console.log({ post: task, comments });

  console.log({ task, task$ });

  if (!task) {
    return <div>loading...</div>;
  }

  return (
    <article>
      <h1>{task.summary}</h1>
      <p>{task.description}</p>
      <h2>sub task</h2>
      {!!taskInspection && (
        <div key={taskInspection.id}>
          <p>{taskInspection.agreementEndDate}</p>
          {/* add room button */}
          <button
            onClick={async () => {
              const room = await taskInspection.addRoom(
                "Room: " + Math.random()
              );
              console.log({ room });
            }}
          >
            Add Room
          </button>
          <br />
          {rooms.map((room) => (
            <div key={room.id}>
              <p>{room.title}</p>
            </div>
          ))}
        </div>
      )}

      {/* delete post button */}
      <button
        onClick={async () => {
          database.write(async () => {
            await task.markAsDeleted(); // syncable
          });
        }}
      >
        Delete Task
      </button>
    </article>
  );
};

const EnhancedTask = TaskItem;

function useObservable<TType>(
  observable: Observable<TType>,
  initial?: TType,
  deps: any[] = []
): TType {
  const [state, setState] = useState(initial);

  useEffect(() => {
    const subscription = observable?.subscribe(setState);
    return () => subscription?.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
