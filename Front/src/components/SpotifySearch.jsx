import React, { useEffect, useRef, useState } from "react";
import utils from "../utils/utils";
import "./SpotifySearch.css";
import server from "../utils/server";

const debounceResults = utils.debounce(async (str, setRes) => {
  const searchResults = await server.getSearchResults(
    localStorage.getItem("authToken"),
    str
  );
  console.log("coucou");
  setRes(searchResults.tracks.items);
  return searchResults;
}, 500);

function SpotifySearch() {
  const userQuery = utils.useCurrentUserQuery();
  const tracks = userQuery.data.info?.tracks;
  const genres = userQuery.data.info?.genres;
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = (search) => {
    setSearch(search);
    debounceResults(search, setResults);
  };
  console.log(results);
  return (
    <div className="SpotifySearch">
      <div className="searchbar">
        <svg
          className="searchicon"
          viewBox="0 0 16 16"
          style={{ padding: "0 5px 0 0" }}
        >
          <path d="M7 1.75a5.25 5.25 0 1 0 0 10.5 5.25 5.25 0 0 0 0-10.5zM.25 7a6.75 6.75 0 1 1 12.096 4.12l3.184 3.185a.75.75 0 1 1-1.06 1.06L11.304 12.2A6.75 6.75 0 0 1 .25 7z"></path>
        </svg>
        <input
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        ></input>
        <svg
          className="searchicon"
          viewBox="0 0 16 16"
          display={search ? "block" : "none"}
          style={{ cursor: "pointer" }}
          onClick={() => setSearch("")}
        >
          <path d="M1.47 1.47a.75.75 0 0 1 1.06 0L8 6.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L9.06 8l5.47 5.47a.75.75 0 1 1-1.06 1.06L8 9.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L6.94 8 1.47 2.53a.75.75 0 0 1 0-1.06z"></path>
        </svg>
      </div>
      {results &&
        results.map((track) => {
          return (
            <div key={track.id} className="tracksRecapItem">
              <img
                className="tracksRecapItem--cover"
                src={track.album.images[0].url}
              />
              <p>
                {track.name} - {track.artists[0].name}
              </p>
            </div>
          );
        })}
    </div>
  );
}
export default SpotifySearch;
