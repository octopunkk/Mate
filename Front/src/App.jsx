import "./App.css";
import Spotify from "./utils/spotify";
import server from "./utils/server";
import { Routes, Route, Outlet, Link } from "react-router-dom";

async function getSpotifyTokens() {
  const redirectURL = await Spotify.getAuthorizeURL();
  window.location = redirectURL;
}

const checkForAuthCode = () => {
  let urlParams = new URLSearchParams(location.search);
  let authCode = urlParams.get("code");
  if (authCode) {
    server.postAuthCode(authCode);
  }
};

const getAuthToken = () => {
  const authToken = localStorage.getItem("authToken");
  if (authToken) {
    // verify token server-side
    const tokenIsValid = server.postAuthToken(authToken);
    if (tokenIsValid) {
      // go to welcome page
    }
  }
};
getAuthToken();
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
