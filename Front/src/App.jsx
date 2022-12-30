import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import Spotify from "./utils/spotify";

const URL = "http://127.0.0.1:8000/";

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

async function postAuthCode(authCode) {
  const response = await fetch(URL + "user", {
    method: "POST",
    mode: "cors",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "default",
    body: JSON.stringify({ authCode }),
  });
  console.log(response);
}

async function getData() {
  let data = await fetch(URLget, { method: "GET" });
  let json = await data.json();
  console.log(json);
}

async function getSpotifyTokens() {
  const redirectURL = await Spotify.getAuthorizeURL();
  window.location = redirectURL;
}

const checkForAuthCode = () => {
  let urlParams = new URLSearchParams(location.search);
  let authCode = urlParams.get("code");
  if (authCode) {
    postAuthCode(authCode);
  }
};

checkForAuthCode();

function App() {
  return (
    <div className="App">
      <h1>Blind Test sans nom pour le moment</h1>
      <p>Et sans blind test</p>
      <p>Ça arrive</p>
      <button onClick={getSpotifyTokens}>Login with Spotify</button>
    </div>
  );
}

export default App;
