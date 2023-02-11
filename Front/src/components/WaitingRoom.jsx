import { useState, useEffect } from "react";
import server from "../utils/server";
import Avatar from "boring-avatars";

function WaitingRoom() {
  const [roomId, setRoomId] = useState("");
  const [user, setUser] = useState({});

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
    <div>
      <h3>Room id : {roomId}</h3>
    </div>
  );
}

export default WaitingRoom;
