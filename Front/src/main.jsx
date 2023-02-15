import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Welcome from "./components/Welcome";
import WaitingRoomHost from "./components/WaitingRoomHost";
import WaitingRoomPlayer from "./components/WaitingRoomPlayer";
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
    path: "/waitingRoomHost",
    element: <WaitingRoomHost />,
  },
  {
    path: "/waitingRoom/:roomId",
    element: <WaitingRoomPlayer />,
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
