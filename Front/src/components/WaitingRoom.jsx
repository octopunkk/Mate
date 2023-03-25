import { useState, useEffect } from "react";
import server from "../utils/server";
import Avatar from "boring-avatars";
import "./WaitingRoom.css";
import { useNavigate, useMatch } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { useQuery, useQueryClient } from "react-query";
import utils from "../utils/utils";
import silencemp3 from "../assets/silence.mp3";
const silence = new Audio(silencemp3);

function WaitingRoom() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const roomId = useMatch("/waitingroom/:roomId").params.roomId;
  const userQuery = utils.useCurrentUserQuery();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomId);
  };

  const quitGame = async () => {
    const res = await server.quitRoom(
      localStorage.getItem("authToken"),
      roomId
    );
    navigate("/");
  };

  const start = () => {
    silence.play();
    navigate("../start/" + roomId);
  };

  const fetchRoomInfo = async () => {
    return await server.getRoomInfo(localStorage.getItem("authToken"), roomId);
  };

  const updateRoomQuery = useQuery(["updateRoom", roomId], fetchRoomInfo, {
    refetchInterval: 2000,
  });

  const kickPlayer = async (playerId) => {
    await server.kickFromRoom(
      localStorage.getItem("authToken"),
      roomId,
      playerId
    );
    queryClient.invalidateQueries(["updateRoom", roomId]);
  };

  useEffect(() => {
    if (
      !updateRoomQuery.isFetching &&
      userQuery.data.userId &&
      !updateRoomQuery.data.players.some(
        (e) => e.spotify_user_id === userQuery.data.userId
      )
    ) {
      queryClient.removeQueries(["updateRoom", roomId]);
      navigate("/");
    }
  }, [updateRoomQuery, userQuery]);

  const isHost =
    updateRoomQuery.data?.host.host_player_id === userQuery.data?.userId;

  if (userQuery.isLoading || updateRoomQuery.isLoading) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="WaitingRoomHost">
      <h2>
        {isHost
          ? "Les joueurs peuvent rejoindre ta partie"
          : "Bienvenue dans la partie de " +
            updateRoomQuery.data.host.spotify_display_name}
      </h2>
      <h3>Joueurs dans la partie : </h3>

      {updateRoomQuery.data.players
        .sort((p1, p2) => p1.spotify_display_name > p2.spotify_display_name)
        .map((player) => {
          return (
            <p className="player" key={player.spotify_user_id}>
              <Avatar
                size={30}
                name={player.spotify_user_id}
                variant="beam"
                colors={["#F6D76B", "#FF9036", "#D6254D", "#FF5475", "#FDEBA9"]}
              />{" "}
              {player.spotify_display_name}
              {isHost &&
                (player.spotify_user_id !== userQuery.data.userId ? (
                  <PersonRemoveIcon
                    color="error"
                    className="icon"
                    onClick={() => {
                      kickPlayer(player.spotify_user_id);
                    }}
                  />
                ) : (
                  " (toi)"
                ))}
            </p>
          );
        })}
      <div className="roomId">
        <h3>Code de la partie :</h3>
        <button className="tooltip" onClick={copyToClipboard}>
          {roomId}
          <p className="tooltiptext">Copier</p>
        </button>
      </div>

      {isHost && (
        <div>
          <br />
          <br />
          <button onClick={start}>Démarrer la partie</button>
        </div>
      )}
      <br />
      <br />
      {isHost && (
        <button onClick={() => navigate("/")}>Retourner à l'accueil</button>
      )}

      {!isHost && (
        <button className="redButton" onClick={quitGame}>
          Quitter la partie
        </button>
      )}
    </div>
  );
}

export default WaitingRoom;
