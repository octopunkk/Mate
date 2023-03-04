import { useState, useEffect } from "react";
import server from "../utils/server";
import Avatar from "boring-avatars";
import "./WaitingRoom.css";
import { useNavigate, useMatch } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { useQuery, useQueryClient } from "react-query";

function WaitingRoom() {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const roomId = useMatch("/waitingroom/:roomId").params.roomId;

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

  useEffect(() => {
    const getUser = async () => {
      const res = await server.getUser(localStorage.getItem("authToken"));
      setUser({
        displayName: res.displayName,
        userId: res.userId,
      });
    };
    getUser();
  }, []);

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
      user.userId &&
      !updateRoomQuery.data.players.some(
        (e) => e.spotify_user_id === user.userId
      )
    ) {
      queryClient.removeQueries(["updateRoom", roomId]);
      navigate("/");
    }
  }, [updateRoomQuery, user]);

  const isHost = updateRoomQuery.data?.host.host_player_id === user?.userId;
  return (
    <div className="WaitingRoomHost">
      {!updateRoomQuery.isLoading ? (
        <div>
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
                    colors={[
                      "#F6D76B",
                      "#FF9036",
                      "#D6254D",
                      "#FF5475",
                      "#FDEBA9",
                    ]}
                  />{" "}
                  {player.spotify_display_name}
                  {isHost &&
                    (player.spotify_user_id !== user.userId ? (
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
              <button onClick={() => navigate("../start/" + roomId)}>
                Démarrer la partie
              </button>
            </div>
          )}
          <br />
          <br />

          {!isHost && (
            <button className="redButton" onClick={quitGame}>
              Quitter la partie
            </button>
          )}
        </div>
      ) : (
        <CircularProgress />
      )}
    </div>
  );
}

export default WaitingRoom;