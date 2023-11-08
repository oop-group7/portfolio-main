import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'react-bootstrap-icons'
import "bootstrap/dist/css/bootstrap.css";
import { PUT, DELETE } from "../utils/apihelper";
import { getUserData } from '../utils/apihelper';
import { useNavigate } from "react-router-dom";

function ProfilePage() {

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [emailError, setEmailError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the user's data here after successful login
    const fetchUserData = async () => {
      try {
        const userData = await getUserData();
        console.log(userData);
        if (userData !== null) {
          setFirstName(userData.firstName);
          setEmail(userData.email);
        }
      } catch (error) {
        // I'm not sure what error to display as an error here
        console.error("API Error:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleModalClose = () => {
    setShowSuccessModal(false);
    window.location.reload();
  };

  async function deleteAccount(event: React.MouseEvent<HTMLButtonElement, MouseEvent>){
    event.preventDefault();
    const res = await DELETE("/api/user/deleteuser", {
    });
    if (!res.response.ok) {
      setError("Account deletion failed. Please check your credentials");
    } else{
      navigate("/register");
    }
  }

  async function routeToChangePassword() {
    navigate("/updatepassword")
  }

  async function handleChanges(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault();
    // Reset previous errors
    setFirstNameError("");
    setEmailError("");

    let hasErrors = false;
    // let newPasswordErrorMessage = "";

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

   // If there are errors, return early
    if (hasErrors) {
      return;
    }
  
  // Update Profile Information
  const updateProfileRes = await PUT("/api/user/updateprofile", {
    body: {
      firstName,
      email,
    },
  });

  if (!updateProfileRes.response.ok) {
    console.log(updateProfileRes.error)
  }else{
    setShowSuccessModal(true);
  }
}

  return (
      <div className="container position-relative">
        
        <div className="register shadow-lg p-3 bg-body rounded">
          <div className="mt-2 d-flex align-items-center">
              <ArrowLeft onClick={() => history.back()} className="me-2 fs-3" />
              <h1 className="heading mx-auto"> Profile</h1>
          </div>

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

            <div className="d-grid gap-2 mb-3">
              <button type="submit" className="btn btn-primary" onClick={handleChanges}>
                Save Changes {/*Should edit information in the backend*/}
              </button>
              <button type="submit" className="btn btn-primary" onClick={routeToChangePassword}>
                Change Password{/*Should edit information in the backend*/}
              </button>
              <button type="submit" className="btn btn-outline-danger" onClick={deleteAccount}>
                Delete My Account {/*Should remove all text in the input*/}
              </button>
            </div>
          </div>

          {/* Success Modal */}
          <div className="modal" tabIndex={1} style={{ display: showSuccessModal ? "block" : "none" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title">Success</h5>
                  <button type="button" 
                  className="btn-close" 
                  aria-label="Close" 
                  onClick={() => {
                    handleModalClose(); // Your modal close logic
                  }}></button>
                </div>
                <div className="modal-body">
                  Profile updated successfully.
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-primary" onClick={handleModalClose}>Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default ProfilePage;
