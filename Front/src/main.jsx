import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Welcome from "./components/Welcome";
import WaitingRoom from "./components/WaitingRoom";
import JoinRoom from "./components/JoinRoom";
import CreateAccount from "./components/CreateAccount";

import StartGame from "./components/StartGame";
import PrivateRoute from "./components/PrivateRoute";
import Header from "./components/Header";
import Settings from "./components/Settings";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/new",
    element: (
      <>
        <Header /> <CreateAccount />
      </>
    ),
  },
  {
    path: "/welcome",
    element: (
      <PrivateRoute>
        <Welcome />
      </PrivateRoute>
    ),
  },
  {
    path: "/waitingRoom/:roomId",
    element: (
      <PrivateRoute>
        <Header />
        <WaitingRoom />
      </PrivateRoute>
    ),
  },
  {
    path: "/me",
    element: (
      <PrivateRoute>
        <Header />
        <Settings />
      </PrivateRoute>
    ),
  },
  {
    path: "/joinRoom",
    element: (
      <PrivateRoute>
        <Header />
        <JoinRoom />
      </PrivateRoute>
    ),
  },
  {
    path: "/start/:roomId",
    element: (
      <PrivateRoute>
        <Header />
        <StartGame />
      </PrivateRoute>
    ),
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
