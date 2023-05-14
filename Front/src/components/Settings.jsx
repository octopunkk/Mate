import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import utils from "../utils/utils";
import "./tracksRecap.css";
import SpotifySearch from "./SpotifySearch";
import { useQueryClient } from "react-query";
import server from "../utils/server";
import minusicon from "../assets/minus.svg";

function Settings() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const userQuery = utils.useCurrentUserQuery();
  const [tracks, setTracks] = useState(userQuery.data.info);

  const addTrack = (track) => {
    if (!tracks.find((t) => t.id == track.id)) {
      const newTracks = tracks ? [track, ...tracks] : [track];
      setTracks(newTracks);
      server.updateTracks(localStorage.getItem("authToken"), newTracks); //mv authtok to server.js
      queryClient.invalidateQueries("user");
    }
  };

  const removeTrack = (trackId) => {
    const newTracks = tracks.filter((t) => t.id !== trackId);
    setTracks(newTracks);
    server.updateTracks(localStorage.getItem("authToken"), newTracks);
    queryClient.invalidateQueries("user");
  };
  return (
    <div>
      <h1>Préférences</h1>
      <h2>Mes titres préférés</h2>
      {tracks ? (
        <div className="tracksRecap">
          {tracks.map((track) => {
            return (
              <div key={track.id} className="trackResult">
                <img className="tracksRecapItem--cover" src={track.cover} />
                <div className="trackResult--text">
                  {track.name} <br /> {track.artist}
                </div>
                <img
                  src={minusicon}
                  className="trackResult--add"
                  onClick={() => {
                    removeTrack(track.id);
                  }}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <p>Aucun titre enrigstré</p>
      )}
      <SpotifySearch addTrack={addTrack} tracks={tracks} />

      <br />
      <br />
      <button onClick={() => navigate("/welcome")}>Retour à l'accueil</button>
    </div>
  );
}
export default Settings;
