import server from "../utils/server";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";

function CreateAccount() {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [error, setError] = useState("");

  return (
    <div className="CreateAccount">
      <h2>Création d'un nouveau compte</h2>
      <p>{error}</p>
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
          onClick={async (e) => {
            e.preventDefault();
            try {
              const res = await server.addUser({
                name: formRef.current.elements.name.value,
                password: formRef.current.elements.password.value,
              });
              navigate("/welcome");
            } catch {
              setError("Ce nom d'utilisateur est déjà pris !");
            }
          }}
        >
          Créer un compte
        </button>
      </form>
    </div>
  );
}

export default CreateAccount;
