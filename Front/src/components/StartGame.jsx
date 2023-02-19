import CircularProgress from "@mui/material/CircularProgress";
import { useState, useEffect } from "react";
import server from "../utils/server";
import utils from "../utils/utils";
import Track from "./Track";

function StartGame() {
  const [roomId, setRoomId] = useState("");
  const [playlist, setPlaylist] = useState([]);
  const [playlistIdx, setPlaylistIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  console.log({ playlistIdx });

  useEffect(() => {
    const getPlaylist = async () => {
      if (roomId) {
        const tracks = (
          await server.getPlaylist(localStorage.getItem("authToken"), roomId)
        ).sort(() => 0.5 - Math.random());
        setPlaylist(tracks);
      }
    };
    getPlaylist();
  }, [roomId]);

  useEffect(() => {
    setRoomId(window.location.pathname.match(/start\/([A-Z]+)/)[1]);
  }, [window.location]);
  return (
    <div>
      {playlist[0] ? (
        <div>
          <Track
            track={playlist[playlistIdx]}
            setPlaylistIdx={setPlaylistIdx}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
          />
        </div>
      ) : (
        <div>
          <h1>Création de la playlist</h1>
          <div>
            <CircularProgress />
          </div>
        </div>
      )}
    </div>
  );
}
export default StartGame;
