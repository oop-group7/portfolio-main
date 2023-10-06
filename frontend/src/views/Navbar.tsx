import "bootstrap/dist/css/bootstrap.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// import { Link, useHistory } from "react-router-dom";
import logo from "../assets/GoldmanSachsLogo.png";
import "./css/Navbar.css";
import { useState, useEffect } from "react";
import { getUserData, logout } from "../utils/apihelper";

function Navbar() {
  const userData = getUserData();

  useEffect(() => {
    if (userData == null) {
      if (
        window.location.pathname !== "/" &&
        window.location.pathname !== "/register" &&
        window.location.pathname !== "/validation" &&
        window.location.pathname !== "/password" &&
        window.location.pathname !== "/passwordvalidation"
      ) {
        window.location.href = "/";
      }
    } 
    else {
      if (
        window.location.pathname === "/" ||
        window.location.pathname === "/register" ||
        window.location.pathname === "/validation" ||
        window.location.pathname === "/password" ||
        window.location.pathname === "/passwordvalidation"
      ) {
        window.location.href = "/homepage";
      }
    }
  }, [window.location.pathname]);

  async function handleLogout() {
    logout();
  }
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <img className="logo mx-3" src={logo} />
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/homepage">Home</a>
                {/* <router-link class="nav-link" to="/register"
                              >Register</router-link> */}
              </li>
              <li className="nav-item">
                <a className="nav-link active" href="/profile">Profile</a>
              </li>
              <li className="nav-item" id="#isLoginDisplay">
                {/* <a href="#" className="formstyles" onClick={handleLogout}>
                  {(userData == null) ? "" : "Logout" }
                </a> */}
                {/* <a className="nav-link active" href="#" onClick={handleLogout}>
                  {(userData == null) ? "" : "Logout"}
                </a> */}
                {userData ? (
                  <a className="nav-link active" href="#" onClick={handleLogout}>
                    Logout
                  </a>
                ) : null}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

// function useIsLoggedIn() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
  
//   useEffect(() => {
//     const userData = getUserData();
//     console.log("User data:", userData);
//     setIsLoggedIn(getUserData() !== null);
//   }, []);
  
//   console.log(isLoggedIn);
//   return isLoggedIn;
// }

export default Navbar;
