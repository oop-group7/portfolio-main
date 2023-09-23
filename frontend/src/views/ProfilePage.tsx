import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.css";

function ProfilePage() {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
        <div className="container position-relative">
            <div className="login shadow-lg p-3 bg-body rounded">
                <h1 className="heading">Profile</h1>

                <div className="m-3">

                    <div className="mb-3">
                      <h5 className="text-left d-flex align-items-center">First Name:
                        <input
                                type="text"
                                className="form-control"
                                id="firstName"
                                placeholder= { firstName }
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                />
                      </h5>
                    </div>

                    <div className="mb-3">
                      <h5 className="text-left d-flex align-items-center">Last Name:
                        <input
                                type="text"
                                className="form-control"
                                id="username"
                                placeholder= { lastName }
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                />
                      </h5>
                    </div>

                    <div className="mb-3">
                      <h5 className="text-left d-flex align-items-center">Username:
                        <input
                                type="text"
                                className="form-control"
                                id="username"
                                placeholder= { userName }
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                />
                      </h5>
                    </div>

                    <div className="mb-3">
                      <h5 className="text-left d-flex align-items-center">Email:
                        <input
                                type="text"
                                className="form-control"
                                id="email"
                                placeholder= { email }
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                />
                      </h5>
                    </div>

                    <div className="mb-3">
                      <h5 className="text-left d-flex align-items-center">Password:
                        <input
                                type="text"
                                className="form-control"
                                id="password"
                                placeholder= "New Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                />
                      </h5>
                    </div>

                    <div className="d-grid gap-2 mb-3">
                        <button type="submit" className="btn btn-primary">
                          Update Profile
                        </button>
                    </div>

                    <div className="d-grid gap-2 mb-3">
                        <button type="submit" className="btn btn-primary">
                            Delete Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </>
  );
}

export default ProfilePage;
