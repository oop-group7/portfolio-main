import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./css/RegisterPage.css";

function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function register() {
    console.log(dob);
  }

  return (
    <>
      <div className="container position-relative">
        <div className="register shadow-lg p-3 bg-body rounded">
          <h1 className="heading">New Account</h1>

          <form className="m-5">
            <div className="mb-4">
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
                onClick={register}
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default RegisterPage;