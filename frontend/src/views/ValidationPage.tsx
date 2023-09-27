import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./css/ValidationPage.css";

function ValidationPage() {
    const navigate = useNavigate();

    function routeToLogin() {
        navigate('/');
    }
  return (
    <>
         <div className="container position-relative">
            <div className="validation shadow-lg p-3 bg-body rounded">
                <h1 className="heading">Validation</h1>

                <div className="m-5">
                    <div className='m-5'>
                        You have successfully registered. To activate your account, please check your email and click the verification link provided.
                    </div>
                    
                    <div className="d-grid gap-2 mb-3">
                        <button type="submit" className="btn btn-primary" onClick={routeToLogin}>
                        Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </>
  );
}

export default ValidationPage;
