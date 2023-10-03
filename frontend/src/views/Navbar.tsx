import "bootstrap/dist/css/bootstrap.css";
import logo from "../assets/GoldmanSachsLogo.png";
import "./css/Navbar.css";
import { useState, useEffect } from "react";
import { getUserData, logout } from "../utils/apihelper";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //const isLoggedOut = !useIsLoggedIn();
  const isLoggedOut = false;
  const userData = getUserData();

  useEffect(() => {
    console.log("User data:", userData);
    setIsLoggedIn(getUserData() !== null);
  }, []);

  console.log(isLoggedIn);

  //console.log("isLoggedOut:", isLoggedOut);

  // useEffect(() => {
  //   if (isLoggedOut) {
  //     if (
  //       window.location.pathname !== "/" &&
  //       window.location.pathname !== "/register" &&
  //       window.location.pathname !== "/validation" &&
  //       window.location.pathname !== "/password" &&
  //       window.location.pathname !== "/passwordvalidation"
  //     ) {
  //       window.location.href = "/";
  //     }
  //   } else {
  //     if (
  //       window.location.pathname === "/" ||
  //       window.location.pathname === "/register" ||
  //       window.location.pathname === "/validation" ||
  //       window.location.pathname === "/password" ||
  //       window.location.pathname === "/passwordvalidation"
  //     ) {
  //       window.location.href = "/homepage";
  //     }
  //   }
  // }, [isLoggedOut]);

  async function handleLogout() {
    logout();
  }
  return (
    <>
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <img className="logo mx-3" src={logo} />
            <div id="#isLoginDisplay">
              <a href="#" className="formstyles" onClick={handleLogout}>
                {isLoggedOut ? "" : "Logout"}
              </a>
            </div>
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
                  {/* <router-link class="nav-link" to="/register"
                                >Register</router-link
                            > */}
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
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
