import React, { useState, useEffect } from 'react';
import { useAuth } from "../componenets/contexts/AuthContext";
import { Button, Card, Form, Alert } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import axios from "axios"; /* for backend requests later */
import "bootstrap/dist/css/bootstrap.css";

/*
To Do:
1. Make the backend logic work
2. Edit the design such that the title of the input box is above and smaller isntead of at the left
3. Make all the texts smaller
4. Make an alert/confirmation after performing an action (i.e, Changes saved)
5. Remove or include the delete button?
*/

function handleSubmit(event){
  event.preventDefault();
  alert("Changes saved!");
}

function ProfilePage() {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(""); /* Store error message */
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  return (
    <>
        <div className="container position-relative">
            <div className="login shadow-lg p-3 bg-body rounded">
                <h1 className="heading">Update Profile</h1>

                <div className="m-3">
                    <div className="mb-3">
                      <h5 className="text-left d-flex align-items-center">First Name 
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
                      <h5 className="text-left d-flex align-items-center">Last Name 
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
                      <h5 className="text-left d-flex align-items-center">Username 
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
                      <h5 className="text-left d-flex align-items-center">Email 
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
                      <h5 className="text-left d-flex align-items-center">Password 
                        <input
                                type="text"
                                className="form-control"
                                id="password"
                                placeholder= { password }
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                />
                      </h5>
                    </div>

                    <div className="d-grid gap-2 mb-3">
                        <button type="submit" className="btn btn-primary">
                          Save Changes
                        </button>
                        <button type="submit" className="btn btn-outline-danger">
                          Discard Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </>
  );
}

export default ProfilePage;
