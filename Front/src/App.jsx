import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import Spotify from "./utils/spotify";

const URL = "http://127.0.0.1:8000/add_event";
const URLget = "http://127.0.0.1:8000/events_list";

async function postData(data) {
  const response = await fetch(URL, {
    method: "POST",
    mode: "cors",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "default",
    body: JSON.stringify(data),
  });
  console.log(response);
}

async function getData() {
  let data = await fetch(URLget, { method: "GET" });
  let json = await data.json();
  console.log(json);
}

async function getSpotifyTokens() {}

console.log(await Spotify.getAuthorizeURL());

function App() {
  return (
    <div className="App">
      <h1>Blind Test sans nom pour le moment</h1>
      <p>Et sans blind test</p>
      <p>Ça arrive</p>
      <button>Login with Spotify</button>
    </div>
  );
}

export default App;
