import React from "react";
import { useNavigate } from "react-router-dom";
import utils from "../utils/utils";
import "./tracksRecap.css";
import SpotifySearch from "./SpotifySearch";

function Settings() {
  const navigate = useNavigate();
  const userQuery = utils.useCurrentUserQuery();
  const tracks = userQuery.data.info?.tracks;
  const genres = userQuery.data.info?.genres;

  return (
    <div>
      <h1>Préférences</h1>
      <h2>Mes titres préférés</h2>
      {tracks ? (
        <div className="tracksRecap">
          {tracks.map((track) => {
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
      ) : (
        <p>Aucun titre enrigstré</p>
      )}
      <SpotifySearch />
      <h2>Mes genres préférés</h2>
      {genres ? <></> : <p>Aucun genre enrigstré</p>}
      <br />
      <br />
      <button onClick={() => navigate("/welcome")}>Retour à l'accueil</button>
    </div>
  );
}
export default Settings;
