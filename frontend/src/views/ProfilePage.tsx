import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.css";
import { PUT, DELETE, POST } from "../utils/apihelper";
import { getUserData } from '../utils/apihelper';
import { useNavigate } from "react-router-dom";

function ProfilePage() {

  const [firstName, setFirstName] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [error, setError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the user's data here after successful login
    const fetchUserData = async () => {
      try {
        const userData = await getUserData();
        console.log(userData);
        setFirstName(userData.firstName);
        setUserName(userData.username);
        setEmail(userData.email);
      } catch (error) {
        // I'm not sure what error to display as an error here
        console.error("API Error:", error);
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

  async function handleChanges(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Reset previous errors
    setFirstNameError("");
    setUserNameError("");
    setEmailError("");
    setNewPasswordError("");

    let hasErrors = false;
    let newPasswordErrorMessage = "";

    if (firstName.trim()==="") {
      setFirstNameError("First Name is required");
      hasErrors=true;
    }

    if (username.trim()==="") {
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

    if (newPassword.trim()==="") {
      setNewPasswordError("Password is required");
      hasErrors=true;
      return;
    }

   if(newPassword.length < 8 || newPassword.length> 25){
      newPasswordErrorMessage += "Password must be between 8 to 25 characters\n";
      hasErrors=true;}

   if(!(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/).test(newPassword)){
      newPasswordErrorMessage += "Password must contain at least one symbol\n";
      hasErrors=true;}

   if(!(/\d/).test(newPassword)){
      newPasswordErrorMessage += "Password must contain at least one numeric character\n";
      hasErrors=true;}

   if(!(/[A-Z]/).test(newPassword)){
      newPasswordErrorMessage += "Password must contain at least one uppercase letter\n";
      hasErrors=true;}

   if(!(/[a-z]/).test(newPassword)){
      newPasswordErrorMessage += "Password must contain at least one lowercase letter\n";
      hasErrors=true;}

  setNewPasswordError(newPasswordErrorMessage);

   // If there are errors, return early
    if (hasErrors) {
      return;
    }

  // Update Profile Information
  const updateProfileRes = await PUT("/api/user/updateprofile", {
    body: {
      firstName,
      username,
      email,
    },
  });

  if (!updateProfileRes.response.ok) {
    console.log(updateProfileRes.error)
    const updateProfileError = updateProfileRes.error;
    setError(updateProfileError.message);
  }

  // Change Password
  const updatePasswordRes = await POST("/api/user/updatepassword", {
    body: {
      oldPassword,
      newPassword,
    },
    });

  if (!updatePasswordRes.response.ok) {
    const updatePasswordError = updatePasswordRes.error;
    setError(updatePasswordError.message);
  }

  if (updateProfileRes.response.ok && updatePasswordRes.response.ok) {
    setError("");
    // Update the state variables with the new data received from the server
    setFirstName(firstName);
    setUserName(username);
    setEmail(email);

    // Clear the password fields for security
    setOldPassword("");
    setNewPassword("");

    window.location.href = "http://localhost:8080/validation";
  }
}

  return (
      <div className="container position-relative">
        <div className="register shadow-lg p-3 bg-body rounded">
          <h1 className="heading">Profile</h1>

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
                placeholder={username}
                value={username}
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
              <label htmlFor="oldpassword">Old Password</label>
              <input
                type="password"
                className="form-control"
                id="oldpassword"
                placeholder={oldPassword}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="newpassword">New Password</label>
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
                id="newpassword"
                placeholder={newPassword}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
