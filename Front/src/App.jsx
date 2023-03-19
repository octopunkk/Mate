import "./App.css";
import Spotify from "./utils/spotify";
import server from "./utils/server";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./assets/mate.svg";

function App() {
  const navigate = useNavigate();
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));

  async function getSpotifyTokens() {
    const redirectURL = await Spotify.getAuthorizeURL();
    window.location = redirectURL;
  }

  const checkForAuthCode = async () => {
    let urlParams = new URLSearchParams(location.search);
    let authCode = urlParams.get("code");
    if (authCode) {
      await server.postAuthCode(authCode);
      setAuthToken(localStorage.getItem("authToken"));
    }
  };

  useEffect(() => {
    const getAuthToken = async () => {
      if (authToken) {
        const user = await server.getUser(authToken);
        if (user) {
          const history = localStorage.getItem("history");
          localStorage.removeItem("history");
          navigate(history || "/welcome");
          return;
        }
      }
      await checkForAuthCode();
    };
    getAuthToken();
  }, [authToken]);

  return (
    <div className="App">
      <div className="title">
        <img className="title--logo" src={logo} />
        <div className="title--text">
          <h1>MATÉ</h1>
          <h2 className="subtitle">Blind Test</h2>
        </div>
      </div>
      <button onClick={getSpotifyTokens}>Se connecter avec Spotify</button>
    </div>
  );
}

export default App;
