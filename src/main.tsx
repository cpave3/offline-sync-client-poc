import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { Database } from "@nozbe/watermelondb";
import LokiJSAdapter from "@nozbe/watermelondb/adapters/lokijs";

import { mySchema as schema } from "./model/schema";
import migrations from "./model/migrations";
import Post from "./model/Post.ts";
import DatabaseProvider from "@nozbe/watermelondb/react/DatabaseProvider";
import Comment from "./model/Comment.ts";
import Task from "./model/Task.ts";
import TaskInspection from "./model/TaskInspection.ts";
import Room from "./model/Room.ts";
// import Post from './model/Post' // ⬅️ You'll import your Models here

// First, create the adapter to the underlying database:
const adapter = new LokiJSAdapter({
  schema,
  // (You might want to comment out migrations for development purposes -- see Migrations documentation)
  migrations,
  useWebWorker: false,
  useIncrementalIndexedDB: true,
  // dbName: 'myapp', // optional db name

  // --- Optional, but recommended event handlers:

  onQuotaExceededError: (error) => {
    // Browser ran out of disk space -- offer the user to reload the app or log out
  },
  onSetUpError: (error) => {
    // Database failed to load -- offer the user to reload the app or log out
  },
  extraIncrementalIDBOptions: {
    onDidOverwrite: () => {
      // Called when this adapter is forced to overwrite contents of IndexedDB.
      // This happens if there's another open tab of the same app that's making changes.
      // Try to synchronize the app now, and if user is offline, alert them that if they close this
      // tab, some data may be lost
    },
    onversionchange: () => {
      // database was deleted in another browser tab (user logged out), so we must make sure we delete
      // it in this tab as well - usually best to just refresh the page
      // check if the user is logged in here
      if (true) {
        window.location.reload();
      }
    },
  },
});

// Then, make a Watermelon database from it!
const database = new Database({
  adapter,
  modelClasses: [
    Post, // ⬅️ You'll add Models to Watermelon here
    Comment,
    Task,
    TaskInspection,
    Room,
  ],
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DatabaseProvider database={database}>
      <App />
    </DatabaseProvider>
  </React.StrictMode>
);
