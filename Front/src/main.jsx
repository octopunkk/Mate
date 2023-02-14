import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Welcome from "./components/Welcome";
import WaitingRoom from "./components/WaitingRoom";
import JoinRoom from "./components/JoinRoom";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/welcome",
    element: <Welcome />,
  },
  {
    path: "/waitingRoom",
    element: <WaitingRoom />,
  },
  {
    path: "/joinRoom",
    element: <JoinRoom />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
