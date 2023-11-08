import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { ArrowLeft } from 'react-bootstrap-icons'
import "bootstrap/dist/css/bootstrap.css";
import { POST } from "../utils/apihelper";

function UpdatePasswordPage() {

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [newPasswordError, setNewPasswordError] = useState("");
  const [oldPasswordError, setOldPasswordError] = useState("");

  const handleModalClose = () => {
    setShowSuccessModal(false);
    window.location.href = "http://localhost:8080/profile";
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    window.location.href = "http://localhost:8080/profile";
  };

  async function handleChanges(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault();
    // Reset previous errors
    setNewPasswordError("");

    let hasErrors = false;
    let newPasswordErrorMessage = "";

    if (oldPassword.trim()==="") {
      setOldPasswordError("Password is required");
      hasErrors=true;
      return;
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

  // Change Password
  const updatePasswordRes = await POST("/api/user/updatepassword", {
    body: {
      oldPassword,
      newPassword,
    },
    });

  if (!updatePasswordRes.response.ok) {
    console.log(updatePasswordRes)
    if (updatePasswordRes.response.status == 400 && updatePasswordRes.error) {
      setOldPasswordError(updatePasswordRes.error?.error)
    }
  }else{
    // Clear the password fields for security
    setOldPassword("");
    setNewPassword("");
    setShowSuccessModal(true);
  }
}

  return (
      <div className="container position-relative">
        
        <div className="register shadow-lg p-3 bg-body rounded">
          <div className="mt-2 d-flex align-items-center">
              <ArrowLeft onClick={() => history.back()} className="me-2 fs-3" />
              <h1 className="heading mx-auto"> Change Password</h1>
          </div>

          <div className="m-3">

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
              <p className="error">{oldPasswordError}</p>
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
              <p className="error">{newPasswordError}</p>
            </div>

            <div className="d-grid gap-2 mb-3">
              <button type="submit" className="btn btn-primary" onClick={handleChanges}>
                Change {/*Should edit information in the backend*/}
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
                  Password updated successfully.
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

export default UpdatePasswordPage;
