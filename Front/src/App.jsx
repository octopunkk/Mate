import "./App.css";
import Spotify from "./utils/spotify";
import server from "./utils/server";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
          navigate("/welcome");
          return;
        }
      }
      await checkForAuthCode();
    };
    getAuthToken();
  }, [authToken]);

  return (
    <div className="App">
      <h1>Blind Test sans nom pour le moment</h1>
      <p>Et sans blind test</p>
      <p>Ça arrive</p>
      <button onClick={getSpotifyTokens}>Se connecter avec Spotify</button>
    </div>
  );
}

export default App;
