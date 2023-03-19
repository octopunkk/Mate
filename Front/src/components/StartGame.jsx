import CircularProgress from "@mui/material/CircularProgress";
import { useState, useEffect } from "react";
import server from "../utils/server";
import Track from "./Track";
import { useNavigate } from "react-router-dom";
import "./StartGame.css";

function StartGame() {
  const [roomId, setRoomId] = useState("");
  const [playlist, setPlaylist] = useState([]);
  const [playlistIdx, setPlaylistIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [gameHasEnded, setGameHasEnded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getPlaylist = async () => {
      if (roomId) {
        const tracks = await server.getPlaylist(
          localStorage.getItem("authToken"),
          roomId
        );
        setPlaylist(tracks);
      }
    };
    getPlaylist();
  }, [roomId]);

  useEffect(() => {
    setRoomId(window.location.pathname.match(/start\/([A-Z]+)/)[1]);
  }, [window.location]);

  if (gameHasEnded) {
    return (
      <div>
        <h2>La partie est terminée !</h2>
        <button onClick={() => navigate("../waitingRoom/" + roomId)}>
          Retour a l'écran de lancement
        </button>
        <br />
        <h3>Liste des titres diffusés</h3>
        <div className="tracksRecap">
          {playlist.slice(0, playlistIdx + 1).map((track) => {
            return (
              <div key={track.id} className="tracksRecapItem">
                <img className="tracksRecapItem--cover" src={track.cover} />
                <p>
                  {track.name} - {track.artist}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (playlist[0]) {
    return (
      <div>
        <Track
          track={playlist[playlistIdx]}
          setPlaylistIdx={setPlaylistIdx}
          playlistIdx={playlistIdx}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          maxLength={playlist.length}
          setGameHasEnded={setGameHasEnded}
        />
      </div>
    );
  }

  return (
    <div>
      <h1>Création de la playlist</h1>
      <div>
        <CircularProgress color="error" />
      </div>
    </div>
  );
}
export default StartGame;
