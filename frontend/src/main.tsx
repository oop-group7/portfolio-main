import React from "react";
import ReactDOM from "react-dom/client";
//import App from "./views/App.tsx";
import Navbar from "./views/Navbar.tsx";
import LoginPage from "./views/LoginPage.tsx";
import RegisterPage from "./views/RegisterPage.tsx";
import HomePage from "./views/HomePage.tsx";
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
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
