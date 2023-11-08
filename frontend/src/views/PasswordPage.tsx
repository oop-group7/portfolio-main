import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/PasswordPage.css";
import { GET } from "../utils/apihelper";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function sendVerification() {
    const res = await GET("/api/auth/forgotpassword", {
      params: {
        query: {
          email,
        },
      },
    });
    if (!res.response.ok) {
      // Handle registration error
      console.log(error);
      setError("Failed");
    } else{
      navigate("/passwordvalidation");
    }
  }

  function routeToLogin() {
    navigate("/");
  }

  return (
    <>
      <div className="container position-relative">
        <div className="password shadow-lg p-3 bg-body rounded">
          <h1 className="heading">Reset Email</h1>

          <div className="m-5">
            <div className="mb-3" id="emailinput">
              Username/Email
              <input
                type="text"
                className="form-control"
                id="email"
                aria-describedby="emailHelp"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="d-grid gap-2 mb-3">
              <button
                type="submit"
                className="btn btn-primary"
                onClick={sendVerification}
              >
                Send
              </button>
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
    </>
  );
}

export default RegisterPage;
