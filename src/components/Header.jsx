import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "./Loader";
import "./styles.css";

function Header() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const userName = localStorage.getItem("userName");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    // Simulate logout delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    setIsLoggingOut(false);
    navigate("/login");
  };

  return (
    <>
      {isLoggingOut && <Loader />}
      <header className="header">
        <div className="header-container">
          <Link to="/" className="header-logo">
            User Management
          </Link>
          <nav className="header-nav">
            {isLoggedIn ? (
              <>
                <span className="header-welcome">Welcome, {userName}!</span>
                <button onClick={handleLogout} className="header-logout-btn" disabled={isLoggingOut}>
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="header-link">
                  Login
                </Link>
                <Link to="/signup" className="header-link">
                  Signup
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}

export default Header;
