import server from "../utils/server";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/mate.svg";

function CreateAccount() {
  const navigate = useNavigate();
  const formRef = useRef(null);

  return (
    <div className="CreateAccount">
      <h2>Création d'un nouveau compte</h2>
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
            server.addUser({
              name: formRef.current.elements.name.value,
              password: formRef.current.elements.password.value,
            });
            navigate("/welcome");
          }}
        >
          Créer un compte
        </button>
      </form>
    </div>
  );
}

export default CreateAccount;
