import { useQuery, useQueryClient } from "react-query";
import server from "./server";
import { useState } from "react";

const fetchUser = () => {
  return server.getUser(localStorage.getItem("authToken"));
};
const useCurrentUserQuery = () => {
  const userQuery = useQuery("user", fetchUser, { retry: false });
  return userQuery;
};
const useRerender = () => {
  const [truc, setTruc] = useState(false);

  return () => {
    setTruc({});
  };
};

const debounce = (func, timeout) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};

export default {
  useCurrentUserQuery,
  useRerender,
  debounce,
};
