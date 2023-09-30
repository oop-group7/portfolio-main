import React from "react";
import ReactDOM from "react-dom/client";
//import App from "./views/App.tsx";
import Navbar from "./views/Navbar.tsx";
import LoginPage from "./views/LoginPage.tsx";
import RegisterPage from "./views/RegisterPage.tsx";
import ValidationPage from "./views/ValidationPage.tsx";
import ValidationPasswordPage from "./views/ValidationPasswordPage.tsx";
import HomePage from "./views/HomePage.tsx";
import ProfilePage from "./views/ProfilePage.tsx"; 
import PasswordPage from "./views/PasswordPage.tsx"; 
import "./views/css/index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <React.StrictMode>
        <Navbar />
        <LoginPage />
      </React.StrictMode>
    ),
  },
  {
    path: "/register", // Add a route for the register page
    element: (
      <React.StrictMode>
        <Navbar />
        <RegisterPage />
      </React.StrictMode>
    ),
  },
  {
    path: "/homepage",
    element: (
      <React.StrictMode>
        <Navbar />
        <HomePage />
      </React.StrictMode>
    ),
  },

  {
    path: "/profile",
    element: (
      <React.StrictMode>
        <Navbar />
        <ProfilePage />
      </React.StrictMode>
    ),
  },

  {
    path: "/validation",
    element: (
      <React.StrictMode>
        <Navbar />
        <ValidationPage />
      </React.StrictMode>
    ),
  },

  {
    path: "/passwordvalidation",
    element: (
      <React.StrictMode>
        <Navbar />
        <ValidationPasswordPage />
      </React.StrictMode>
    ),
  },

  {
    path: "/password",
    element: (
      <React.StrictMode>
        <Navbar />
        <PasswordPage />
      </React.StrictMode>
    ),
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
