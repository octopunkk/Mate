import "./Welcome.css";
import { useNavigate } from "react-router-dom";
import server from "../utils/server";
import { useState, useEffect } from "react";
import Avatar from "boring-avatars";

function Welcome() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const disconnect = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    const getUser = async () => {
      const res = await server.getUser(localStorage.getItem("authToken"));
      setUser({
        displayName: res.displayName,
        userId: res.userId,
      });
    };
    getUser();
  }, []);

  return (
    <div className="Welcome">
      <h2>Connecté.e en tant que {user.displayName}</h2>
      <Avatar
        size={100}
        name={user.userId}
        variant="beam"
        colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
      />
      <br /> <br />
      <button>Créer une partie</button>
      <br /> <br />
      <button>Rejoindre une partie</button>
      <br /> <br />
      <button onClick={disconnect}>Se déconnecter</button>
    </div>
  );
}

export default Welcome;
