import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./css/RegisterPage.css";
import { client } from "../utils/apihelper";

function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function registerUser() {
    const res = await client.get().POST("/api/auth/signup", {
      body: {
        email,
        firstName,
        lastName,
        password,
        userName,
      },
    });
    if (!res.response.ok) {
      const error = res.error; // Error message, might have a message or might not, hence you must handle both cases (if the type of the error is undefined only, don't bother)
      // Not all API endpoints return back an
      // Do something
    } else {
      // If the registration function does not throw an error, it's successful
      window.location.href = "http://localhost:8080/validation";
    }
  }

  function routeToLogin() {
    navigate("/");
  }

  return (
    <>
      <div className="container position-relative">
        <div className="register shadow-lg p-3 bg-body rounded">
          <h1 className="heading">New Account</h1>

          <div className="m-5">
            <div className="mb-2">
              First Name
              <input
                type="text"
                className="form-control"
                id="firstname"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              Last Name
              <input
                type="text"
                className="form-control"
                id="lastname"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              Username
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              Email
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Email"
                v-model="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              Password
              <div className="icon-container">
                <FontAwesomeIcon className="mx-2" icon={faCircleInfo} />
                <div className="message">
                  Between 8-25 characters, has at least a symbol, a numeric
                  character, and an upper and lowercase letter
                </div>
              </div>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="d-grid gap-2 mb-3">
              <button
                type="submit"
                className="btn btn-primary"
                onClick={registerUser}
              >
                Register
              </button>

              <div className="d-grid gap-2 mb-3">
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={routeToLogin}
                >
                  Back to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RegisterPage;
