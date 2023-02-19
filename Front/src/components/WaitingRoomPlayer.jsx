import { useState, useEffect } from "react";
import server from "../utils/server";
import Avatar from "boring-avatars";
import "./WaitingRoomHost.css";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

function WaitingRoomPlayer() {
  const [roomId, setRoomId] = useState("");
  const [user, setUser] = useState({});
  const [players, setPlayers] = useState();
  const [host, setHost] = useState("");
  const navigate = useNavigate();

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

  useEffect(() => {
    let intervalId;
    if (roomId) {
      intervalId = setInterval(async () => {
        if (roomId) {
          const res = await server.getPlayersInRoom(
            localStorage.getItem("authToken"),
            roomId
          );
          setPlayers(res.players);
          console.log(user.userId);
          if (
            res.players &&
            user.userId &&
            !res.players.some((e) => e.spotify_user_id === user.userId)
          ) {
            console.log(res.players, user);
            navigate("/");
          }
        }
      }, 1000);
      const getHost = async () => {
        const res = await server.getHost(
          localStorage.getItem("authToken"),
          roomId
        );
        setHost({
          displayName: res.spotify_display_name,
          userId: res.host_player_id,
        });
      };
      getHost(roomId);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [roomId, user]);

  if (host.userId && user.userId && host.userId === user.userId) {
    navigate("/waitingRoomHost");
  }

  useEffect(() => {
    setRoomId(window.location.pathname.match(/waitingRoom\/([A-Z]+)/)[1]);
  }, [window.location]);

  return (
    <div className="WaitingRoomHost">
      <h2>Bienvenue dans la partie de {host.displayName}</h2>
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
      <button className="redButton" onClick={quitGame}>
        Quitter la partie
      </button>
    </div>
  );
}

export default WaitingRoomPlayer;
