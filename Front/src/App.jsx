import "./App.css";
import Spotify from "./utils/spotify";
import server from "./utils/server";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./assets/mate.svg";

function App() {
  const navigate = useNavigate();
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));
  const formRef = useRef(null);
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
      <form id="form" ref={(r) => (formRef.current = r)}>
        <input placeholder="Nom d'utilisateur" id="name" maximum-scale="1" />
        <br /> <br />
        <input
          placeholder="Mot de passe"
          type="password"
          id="password"
          maximum-scale="1"
        />
        <br /> <br />
        <button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            server.connectUser({
              name: formRef.current.elements.name.value,
              password: formRef.current.elements.password.value,
            });
            navigate("/welcome");
          }}
        >
          Se connecter
        </button>
      </form>
      <p>ou</p>
      <button onClick={() => {}}>Créer un compte</button>
    </div>
  );
}

export default App;
