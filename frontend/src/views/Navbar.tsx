import "bootstrap/dist/css/bootstrap.css";
import logo from "../assets/GoldmanSachsLogo.png";
import "./css/Navbar.css";
import React, { useState, useEffect } from 'react';
import { ifLogin, logout } from '../utils/fetcher';

function Navbar() {
  const accessToken = ifLogin();
  
  const [isLoggedOut, setIsLoggedOut] = useState(true); // Assume initially logged out


  if (!accessToken) {
    // User is not logged in, redirect to the root ("/") or login page
    if (window.location.pathname !== '/' && window.location.pathname !== '/register' && window.location.pathname !== '/validation') {
      window.location.href = '/';
    }
  } else {
    // User is logged in, redirect to the homepage if on one of the specified paths
    if (window.location.pathname === '/' || window.location.pathname === '/register' || window.location.pathname === '/validation') {
      window.location.href = '/homepage';
    }
  }
  

  useEffect(() => {
    // Update the state based on whether there is an accessToken
    setIsLoggedOut(!accessToken);
  }, [accessToken]);

  async function handleLogout(){
    logout();
  }
  return (
    <>
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <img className="logo mx-3" src={logo}/>
            <div id ="#isLoginDisplay">
            <a href="#" className="formstyles" onClick={handleLogout}>  
            {isLoggedOut ? '' : 'Logout'}</a>
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

export default Navbar;
