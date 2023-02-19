import { useState, useEffect } from "react";
import server from "../utils/server";
import Avatar from "boring-avatars";
import "./WaitingRoomHost.css";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

function WaitingRoomHost() {
  const [roomId, setRoomId] = useState("");
  const [user, setUser] = useState({});
  const [players, setPlayers] = useState();
  const navigate = useNavigate();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomId);
  };

  const updatePlayers = async () => {
    if (roomId) {
      const res = await server.getPlayersInRoom(
        localStorage.getItem("authToken"),
        roomId
      );
      setPlayers(res.players);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      const res = await server.getUser(localStorage.getItem("authToken"));
      setUser({
        displayName: res.displayName,
        userId: res.userId,
      });
    };
    const createRoom = async () => {
      const res = await server.createRoom(localStorage.getItem("authToken"));
      setRoomId(res.roomId);
    };
    getUser();
    createRoom();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(updatePlayers, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [roomId]);

  return (
    <div className="WaitingRoomHost">
      <h2>Les joueurs peuvent rejoindre la partie</h2>
      <h3>Joueurs dans la partie : </h3>

      {players ? (
        players.map((player) => {
          return (
            <p className="player" key={player.spotify_user_id}>
              <Avatar
                size={30}
                name={player.spotify_user_id}
                variant="beam"
                colors={["#F6D76B", "#FF9036", "#D6254D", "#FF5475", "#FDEBA9"]}
              />{" "}
              {player.spotify_display_name}
              {player.spotify_user_id !== user.userId ? (
                <PersonRemoveIcon
                  color="error"
                  className="icon"
                  onClick={() =>
                    server.kickFromRoom(
                      localStorage.getItem("authToken"),
                      roomId,
                      player.spotify_user_id
                    )
                  }
                />
              ) : (
                " (toi)"
              )}
            </p>
          );
        })
      ) : (
        <CircularProgress />
      )}

      <div className="roomId">
        <h3>Code de la partie :</h3>
        <button className="tooltip" onClick={copyToClipboard}>
          {roomId}
          <p className="tooltiptext">Copier</p>
        </button>
      </div>

      <br />
      <br />
      <button onClick={() => navigate("../start/" + roomId)}>
        Démarrer la partie
      </button>
    </div>
  );
}

export default WaitingRoomHost;
