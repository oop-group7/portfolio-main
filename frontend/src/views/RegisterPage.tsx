import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./css/RegisterPage.css";
import { POST } from "../utils/apihelper";


function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [firstNameError, setFirstNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  async function registerUser() {

    // Reset previous errors
      setFirstNameError("");
      setEmailError("");

      let passwordErrorMessage ="";
      let hasErrors = false;

      if (firstName.trim()==="") {
        setFirstNameError("First Name is required");
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

    const res = await POST("/api/auth/signup", {
      body: {
        firstName,
        email,
        password,
      },
    });
    if (!res.response.ok) {
      const error = res.error; // Not all API endpoints return back an Error message, might have a message or might not, hence you must handle both cases (if the type of the error is undefined only, don't bother)
      console.log(error)
      if (error) {
        setEmailError(error.error);
      }

    } else {
      // If the registration function does not throw an error, it's successful
      setEmailError("");
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
              <p className="error">{firstNameError}</p>
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
              <p className="error">{emailError}</p>
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
              <p className="error">{passwordError}</p>
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
