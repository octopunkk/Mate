import logo from "../assets/mate.svg";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  return (
    <div className="header">
      <img
        className="header--logo"
        src={logo}
        width="80px"
        onClick={() => navigate("/welcome")}
      />
      <h1>MATÉ</h1>
    </div>
  );
}
export default Header;
