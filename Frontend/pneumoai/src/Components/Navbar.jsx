import { NavLink } from "react-router-dom";
import "../App.css";

const Navbar = () => {
  return (
    <>
      <header>
        <div className="nav-container">
          <div className="logo">
            <NavLink to="/">PneumoAI</NavLink>
          </div>
          <nav>
            <ul>
              <li>
                <NavLink to="/SignupPage">SignUp</NavLink>
              </li>
              <li>
                <NavLink to="/LoginPage">LogIn</NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
};
export default Navbar;
