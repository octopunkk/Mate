import { CircularProgress } from "@mui/material";
import React, { useContext, createContext, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";

import utils from "../utils/utils";

function PrivateRoute({ children, ...rest }) {
  const userQuery = utils.useCurrentUserQuery();
  const location = useLocation();
  useEffect(() => {
    if (!userQuery.isLoading && !userQuery.isSuccess) {
      localStorage.setItem("history", location.pathname);
    }
  }, [userQuery]);

  if (userQuery.isLoading) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }

  if (userQuery.isSuccess) {
    return children;
  }

  return (
    <Navigate
      to={{
        pathname: "/",
      }}
    />
  );
}

export default PrivateRoute;
