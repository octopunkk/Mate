import { useState, useEffect } from "react";
import server from "../utils/server";
import { useNavigate } from "react-router-dom";

function JoinRoom() {
  const [roomCode, setRoomCode] = useState("");
  const [errMessage, setErrMessage] = useState({ err: "", status: "hidden" });
  const navigate = useNavigate();

  const join = async () => {
    if (roomCode.length == 5) {
      try {
        const room = await server.joinRoom(
          localStorage.getItem("authToken"),
          roomCode
        );
        console.log({ room });
        navigate("../waitingRoom/" + room.room_id);
      } catch (e) {
        console.error(e);
        setErrMessage({
          err: "Erreur : Code introuvable",
          visibility: "visible",
        });
      }
    } else {
      setErrMessage({
        err: "Erreur : Code trop court !",
        visibility: "visible",
      });
    }
  };
  const keyHandler = (event) => {
    if (event.key === "Enter") {
      join();
      return;
    }
  };
  useEffect(() => {
    document.addEventListener("keydown", keyHandler, false);

    return () => {
      document.removeEventListener("keydown", keyHandler, false);
    };
  });

  return (
    <div>
      <h1>Rejoindre une partie</h1>
      <h4>Entre le code de la partie</h4>
      <h4 visibility={errMessage.visibility} style={{ color: "#f44336" }}>
        {errMessage.err}
      </h4>
      <input
        autoFocus
        value={roomCode}
        maxLength="5"
        onChange={(e) => {
          setRoomCode(e.target.value.toUpperCase());
          setErrMessage({ visibility: "hidden" });
        }}
      ></input>
      <br></br>
      <br></br>
      <button onClick={join}>Rejoindre la partie</button>
      <br></br>
      <br></br>
      <button onClick={() => navigate("/")}>Retourner à l'accueil</button>
    </div>
  );
}

export default JoinRoom;
