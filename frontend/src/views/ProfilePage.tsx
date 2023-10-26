import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.css";

function ProfilePage() {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("
  ");

  return (
      <div className="container position-relative">
        <div className="login shadow-lg p-3 bg-body rounded"> {/*Edit such that all buttons are encapsulated inside this container`*/}
          <h1 className="heading">Update Profile</h1>

          <div className="m-3">
            <div className="mb-3">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                className="form-control"
                id="firstName"
                placeholder={firstName}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                className="form-control"
                id="lastName"
                placeholder={lastName}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="userName">Username</label>
              <input
                type="text"
                className="form-control"
                id="userName"
                placeholder={userName}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                className="form-control"
                id="email"
                placeholder={email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password">Password</label>
              <input
                type="text"
                className="form-control"
                id="password"
                placeholder={password}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="d-grid gap-2 mb-3">
              <button type="submit" className="btn btn-primary">
                Save Changes {/*Should edit information in the backend*/}
              </button>
              <button type="submit" className="btn btn-outline-danger">
                Discard Changes {/*Should remove all text in the input*/}
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}

export default ProfilePage;
