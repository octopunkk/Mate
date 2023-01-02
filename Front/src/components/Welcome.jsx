import "./Welcome.css";

const user = {
  dispayName: localStorage.getItem("displayName"),
  profilePic: localStorage.getItem("profilePic"),
};

function Welcome() {
  console.log(user);
  return (
    <div className="Welcome">
      <h1>Bienvenue {user.dispayName}</h1>
      <img
        className="userProfilePic"
        src={user.profilePic}
        height="100"
        width="100"
        alt="User profile picture"
      />
      <br /> <br />
      <button>Créer une partie</button>
      <br /> <br />
      <button>Rejoindre une partie</button>
      <br /> <br />
      <button>Se déconnecter</button>
    </div>
  );
}

export default Welcome;
