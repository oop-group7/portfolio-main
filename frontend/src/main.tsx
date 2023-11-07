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
import CreatePortfolioPage from "./views/CreatePortfolioPage.tsx";
import PortfolioPage from "./views/IndividualPortfolio.tsx";
import "./views/css/index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <React.StrictMode>
        <Navbar>
          <LoginPage />
        </Navbar>
      </React.StrictMode>
    ),
  },
  {
    path: "/register", // Add a route for the register page
    element: (
      <React.StrictMode>
        <Navbar>
          <RegisterPage />
        </Navbar>
      </React.StrictMode>
    ),
  },
  {
    path: "/homepage",
    element: (
      <React.StrictMode>\
        <Navbar>
          <HomePage />
        </Navbar>
      </React.StrictMode>
    ),
  },

  {
    path: "/profile",
    element: (
      <React.StrictMode>
        <Navbar>
          <ProfilePage />
        </Navbar>
      </React.StrictMode>
    ),
  },

  {
    path: "/validation",
    element: (
      <React.StrictMode>
        <Navbar>
          <ValidationPage />
        </Navbar>
      </React.StrictMode>
    ),
  },

  {
    path: "/passwordvalidation",
    element: (
      <React.StrictMode>
        <Navbar>
          <ValidationPasswordPage />
        </Navbar>
      </React.StrictMode>
    ),
  },

  {
    path: "/password",
    element: (
      <React.StrictMode>
        <Navbar>
          <PasswordPage />
        </Navbar>
      </React.StrictMode>
    ),
  },

  {
    path: "/createportfolio",
    element: (
      <React.StrictMode>
        <Navbar />
        <CreatePortfolioPage />
      </React.StrictMode>
    ),
  },

  {
    path: "/portfolio",
    element: (
      <React.StrictMode>
        <Navbar />
        <PortfolioPage />
      </React.StrictMode>
    ),
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
