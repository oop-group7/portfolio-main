import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.css";
import { GET, POST } from "../utils/apihelper";

function ProfilePage() {

  const [firstName, setFirstName] = useState("");
  // const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [firstNameError, setFirstNameError] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    // Fetch the user's data here after successful login
    const fetchUserData = async () => {
      try {
        const userData = await GET("/api/users"); // Replace with the actual API endpoint to fetch user data
        setFirstName(userData.firstName);
        setUserName(userData.userName);
        setEmail(userData.email);
        // insert password here
      } catch (error) {
        // Handle errors, such as the user not being authenticated or the API request failing
        // You can redirect the user to the login page or display an error message
      }
    };

    fetchUserData();
  }, []);

  async function handleChanges(){
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

  const res = await POST("/updateprofile", { // Check if the path is correct, do I need to put api/ at the start?
    body: {
      firstName,
      userName,
      email,
      password,
    },
  });
  if (!res.response.ok) {
    const error = res.error; // Not all API endpoints return back an Error message, might have a message or might not, hence you must handle both cases (if the type of the error is undefined only, don't bother)
    setEmailError(error.message);

  } else {
    // If the registration function does not throw an error, it's successful
    setEmailError("");
    window.location.href = "http://localhost:8080/validation";
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

            {/* <div className="mb-3">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                className="form-control"
                id="lastName"
                placeholder={lastName}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div> */}

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
              <button type="submit" className="btn btn-outline-danger">
                Delete My Account {/*Should remove all text in the input*/}
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}

export default ProfilePage;
