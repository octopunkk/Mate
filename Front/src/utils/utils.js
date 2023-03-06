import { useQuery, useQueryClient } from "react-query";
import server from "./server";

const fetchUser = () => {
  return server.getUser(localStorage.getItem("authToken"));
};
const useCurrentUserQuery = () => {
  const userQuery = useQuery("user", fetchUser, { retry: false });
  return userQuery;
};

export default {
  useCurrentUserQuery,
};
