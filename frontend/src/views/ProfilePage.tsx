import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.css";
import { PUT, DELETE } from "../utils/apihelper";
import { getUserData } from '../utils/apihelper';
import { useNavigate } from "react-router-dom";

function ProfilePage() {

  const [firstName, setFirstName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [firstNameError, setFirstNameError] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the user's data here after successful login
    const fetchUserData = async () => {
      try {
        const userData = await getUserData();
        setFirstName(userData.firstName);
        setUserName(userData.userName);
        setEmail(userData.email);
        setPassword(userData.password); // user data does not contain password i think
      } catch (error) {
        // I'm not sure what error to display as an error here
      }
    };
    fetchUserData();
  }, []);

  async function deleteAccount(event: React.FormEvent<HTMLFormElement>){
    event.preventDefault();
    const res = await DELETE("/api/user/deleteuser", {
    });
    if (!res.response.ok) {
      setError("Account deletion failed. Please check your credentials");
    } else{
      navigate("/register");
    }
  }

  async function handleChanges(event: React.FormEvent<HTMLFormElement>){
    event.preventDefault();
    // Reset previous errors
    setFirstNameError("");
    setUserNameError("");
    setEmailError("");

    let passwordErrorMessage ="";
    let hasErrors = false;

    if (firstName.trim()==="") {
      setFirstNameError("First Name is required");
      hasErrors=true;
    }

    if (userName.trim()==="") {
      setUserNameError("Username is required");
      hasErrors=true;
      }

    if (email.trim()==="") {
      setEmailError("Email is required");
      hasErrors=true;
      }

    else if(!email.includes("@")){
      setEmailError("Invalid Email. Email must include the @ symbol");
      hasErrors=true;
    }

    else if(!(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).test(email)){
      setEmailError("Invalid Email. Please check again");
      hasErrors=true;
    }

    if (password.trim()==="") {
      setPasswordError("Password is required");
      hasErrors=true;
      return;
    }

   if(password.length < 8 || password.length> 25){
      passwordErrorMessage += "Password must be between 8 to 25 characters\n";
      hasErrors=true;}

   if(!(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/).test(password)){
      passwordErrorMessage += "Password must contain at least one symbol\n";
      hasErrors=true;}

   if(!(/\d/).test(password)){
      passwordErrorMessage += "Password must contain at least one numeric character\n";
      hasErrors=true;}

   if(!(/[A-Z]/).test(password)){
      passwordErrorMessage += "Password must contain at least one uppercase letter\n";
      hasErrors=true;}

   if(!(/[a-z]/).test(password)){
      passwordErrorMessage += "Password must contain at least one lowercase letter\n";
      hasErrors=true;}

  setPasswordError(passwordErrorMessage);

   // If there are errors, return early
    if (hasErrors) {
      return;
    }

  const res = await PUT("/api/user/updateprofile", {
    body: {
      firstName,
      userName,
      email,
      password
    },
  });
  
  if (!res.response.ok) {
    const error = res.error;
    setError(error.message);

  } else {
    setError("");
    window.location.href = "http://localhost:8080/validation"; // Not sure if this should be here
  }
}

  return (
      <div className="container position-relative">
        <div className="register shadow-lg p-3 bg-body rounded">
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
                placeholder={password}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="d-grid gap-2 mb-3">
              <button type="submit" className="btn btn-primary" onClick={handleChanges}>
                Save Changes {/*Should edit information in the backend*/}
              </button>
              <button type="submit" className="btn btn-outline-danger" onClick={deleteAccount}>
                Delete My Account {/*Should remove all text in the input*/}
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}

export default ProfilePage;
