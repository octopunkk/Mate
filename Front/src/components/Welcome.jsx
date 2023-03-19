import "./Welcome.css";
import React from "react";
import { useNavigate } from "react-router-dom";
import server from "../utils/server";
import Avatar from "boring-avatars";
import { useQuery, useQueryClient } from "react-query";
import { CircularProgress } from "@mui/material";
import utils from "../utils/utils";
import logo from "../assets/mate.svg";

function Welcome() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const disconnect = () => {
    localStorage.clear();
    queryClient.invalidateQueries("user");
    navigate("/");
  };

  const createRoom = async () => {
    const res = await server.createRoom(localStorage.getItem("authToken"));
    return res.id;
  };

  const goToWaitingRoom = async () => {
    const roomId = await createRoom();
    navigate("../waitingRoom/" + roomId);
  };
  const goToJoinRoom = () => {
    navigate("../joinRoom");
  };

  const userQuery = utils.useCurrentUserQuery();

  if (userQuery.isLoading) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="Welcome">
      <div className="title">
        <img className="title--logo" src={logo} />
        <div className="title--text">
          <h1>MATÉ</h1>
          <h2 className="subtitle">Blind Test</h2>
        </div>
      </div>
      <h2>Connecté.e en tant que {userQuery.data.displayName}</h2>
      <Avatar
        size={100}
        name={userQuery.data.userId}
        variant="beam"
        colors={["#F6D76B", "#FF9036", "#D6254D", "#FF5475", "#FDEBA9"]}
      />
      <br /> <br />
      <button onClick={goToWaitingRoom}>Créer une partie</button>
      <br /> <br />
      <button onClick={goToJoinRoom}>Rejoindre une partie</button>
      <br /> <br />
      <button onClick={disconnect}>Se déconnecter</button>
    </div>
  );
}

export default Welcome;
