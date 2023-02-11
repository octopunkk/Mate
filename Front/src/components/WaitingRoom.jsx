import { useState, useEffect } from "react";
import server from "../utils/server";
import Avatar from "boring-avatars";
import "./WaitingRoom.css";

function WaitingRoom() {
  const [roomId, setRoomId] = useState("");
  const [user, setUser] = useState({});

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomId);
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

  return (
    <div className="WaitingRoom">
      <h2>Les joueurs peuvent rejoindre la partie</h2>
      <h3>Joueurs dans la partie : </h3>
      <p className="player">
        <Avatar
          size={30}
          name={user.userId}
          variant="beam"
          colors={["#F6D76B", "#FF9036", "#D6254D", "#FF5475", "#FDEBA9"]}
        />{" "}
        {user.displayName} (toi)
      </p>
      <div className="roomId">
        <h3>Code de la partie :</h3>
        <button className="tooltip" onClick={copyToClipboard}>
          {roomId}
          <p className="tooltiptext">Copier</p>
        </button>
      </div>
    </div>
  );
}

export default WaitingRoom;
