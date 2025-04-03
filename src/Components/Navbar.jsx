import React from "react";
import { Link } from "react-router-dom";
import "./Styles/Navbar.scss";

const Navbar = ({ isMobileNavOpen, toggleMobileNav }) => {
  const toggleTheme = () => {
    document.body.classList.toggle("dark-theme");
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <img src="/images/Fudtrack2.png" alt="Logo Alma - Zen" />
        </Link>
      </div>

      <div className="nav-extra">
        <button className="theme-toggle" onClick={toggleTheme}></button>
      </div>

      <div className={`nav-links ${isMobileNavOpen ? "open" : ""}`}>
        {localStorage.getItem("authToken") ? (
          <Link to="/profile">Profile</Link>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/signup">Sign-up</Link>
          </>
        )}
        <Link to="/Almacen">Start</Link>
        <a href="#prices">Prices</a>
        <a href="#about">About</a>
      </div>

      <div className="nav-toggle" onClick={toggleMobileNav}>
        <span className="hamburger"></span>
        <span className="hamburger"></span>
        <span className="hamburger"></span>
      </div>
    </nav>
  );
};

export default Navbar;











