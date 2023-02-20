import React, { useEffect, useState } from "react";

function Track(props) {
  const track = props.track;
  return (
    <div>
      {props.isPlaying ? (
        <div>
          <audio
            autoPlay
            controls
            src={track.preview}
            onEnded={() => props.setIsPlaying(false)}
          />
          <br />
          <button onClick={() => props.setIsPlaying(false)}>
            Révéler le titre
          </button>
        </div>
      ) : (
        <div>
          <h3>Tu viens d'écouter</h3>
          <h4>
            {track.artist} - {track.name}
          </h4>
          <p>de l'album {track.album}</p>
          <img src={track.cover} height="200" />
          <br /> <br />
          <button
            onClick={() => {
              if (props.playlistIdx + 1 < props.maxLength) {
                props.setPlaylistIdx((p) => p + 1);
                props.setIsPlaying(true);
              } else {
                props.setGameHasEnded(true);
              }
            }}
          >
            Passer à la chanson suivante
          </button>
        </div>
      )}
    </div>
  );
}
export default Track;
