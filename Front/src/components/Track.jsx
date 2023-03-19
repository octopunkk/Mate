import React, { useEffect, useRef, useState } from "react";
import vinyl from "../assets/vinyl.svg";
import vinyl_arm from "../assets/vinyl-arm.svg";
import utils from "../utils/utils";

function Track(props) {
  const track = props.track;
  const audioRef = useRef(null);
  const rerender = utils.useRerender();

  return (
    <div>
      {props.isPlaying ? (
        <div>
          <audio
            ref={(el) => {
              audioRef.current = el;
              el?.addEventListener("pause", () => {
                rerender();
              });
              el?.addEventListener("play", () => {
                rerender();
              });
            }}
            autoPlay
            src={track.preview}
            onEnded={() => props.setIsPlaying(false)}
          />
          <div
            className="in-game--vinyl"
            onClick={() =>
              audioRef.current.paused
                ? audioRef.current.play()
                : audioRef.current.pause()
            }
          >
            <img
              className={
                audioRef.current?.paused ? "vinylicon" : "vinylicon running"
              }
              src={vinyl}
              width="160px"
            />
            <img
              className={
                audioRef.current?.paused ? "vinyl_arm" : "vinyl_arm running"
              }
              src={vinyl_arm}
              width="190px"
              // width="200px"
            />
          </div>

          <br />
          <button onClick={() => props.setIsPlaying(false)}>
            Révéler le titre
          </button>
        </div>
      ) : (
        <div>
          <h3>Tu viens d'écouter</h3>
          <h4>
            {track.name} - {track.artist}
          </h4>
          <p>de l'album {track.album}</p>
          <img className="track--cover" src={track.cover} height="200" />
          <br /> <br />
          {props.playlistIdx + 1 < props.maxLength && (
            <button
              onClick={() => {
                props.setPlaylistIdx((p) => p + 1);
                props.setIsPlaying(true);
              }}
            >
              Passer à la chanson suivante
            </button>
          )}
          <br />
          <br />
          <button
            onClick={() => {
              props.setGameHasEnded(true);
            }}
          >
            Terminer la partie
          </button>
        </div>
      )}
    </div>
  );
}
export default Track;
