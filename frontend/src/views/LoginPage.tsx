import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../utils/apihelper";
import "./css/LoginPage.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogin() {
    try {
      // Call the login function from fetcher.ts
      await login(email, password);
      // If the login function does not throw an error, it's successful
    } catch (error) {
      // Handle login error
      setError("Login failed. Please check your credentials.");
    }
  }

  function routeToRegister() {
    navigate("/register");
  }

  return (
    <>
      <div className="container position-relative">
        <div className="login shadow-lg p-3 bg-body rounded">
          <h1 className="heading">Login</h1>

          <div className="m-5">
            <div className="mb-3" id="emailinput">
              Username/Email
              <input
                type="text"
                className="form-control"
                id="email"
                aria-describedby="emailHelp"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div id="emailHelp" className="form-text">
                We'll never share your email with anyone else.
              </div>
            </div>

            <div className="mb-3" id="pwinput">
              Password
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <a href="/password" className="formstyles">
                Forgot password?
              </a>
            </div>

            <div className="d-grid gap-2 mb-3">
              <button
                type="submit"
                className="btn btn-primary"
                onClick={handleLogin}
              >
                Login
              </button>
            </div>

            <div className="d-grid gap-2 mb-3">
              <button
                type="submit"
                className="btn btn-primary"
                onClick={routeToRegister}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
