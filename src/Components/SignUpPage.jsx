import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Styles/SignUpPage.scss";

const SignUpPage = () => {
  // Hook para navegar entre rutas
  const navigate = useNavigate();

  // Función que regresa al login
  const handleBack = () => {
    navigate("/login");
  };

  return (
    <div className="signup-page">
      {/* Flecha en la parte superior izquierda */}
      <button className="login-page__back" onClick={handleBack}>
        <span className="arrow-left">◀</span>
      </button>

      {/* Lado izquierdo: imagen y texto */}
      <div className="signup-page__left">
        <img
          src="Images/Worker.png"
          alt="Warehouse with inventory"
        />
        <div className="signup-page__overlay">
          <h2>“Control, organize and optimize your inventory in a  efficiently way.”</h2>
        </div>
      </div>

      {/* Lado derecho: formulario */}
      <div className="signup-page__right">
        <div className="signup-page__logo">
          <img
            src="Images/Logo.png"
            alt="Alma-zen logo"
          />
        </div>
        <h2 className="signup-page__title">Create your account</h2>

        <form className="signup-page__form">
          <label>
            Username
            <input type="text" placeholder="Enter your username" />
          </label>
          <label>
            Email
            <input type="email" placeholder="Enter your email" />
          </label>
          <label>
            Password
            <input type="password" placeholder="••••••••" />
          </label>
          <label>
            Confirm Password
            <input type="password" placeholder="••••••••" />
          </label>
          <label>
            Phone Number
            <input type="tel" placeholder="e.g. +51 618 274 3609" />
          </label>
        </form>

        {/* Botón principal */}
        <button className="signup-page__main-btn">Sign In</button>

        {/* Botones de redes sociales */}
        <div className="signup-page__social">
          <button className="signup-page__social-btn facebook-btn">
            <span className="icon"><img src="/Images/Facebook-logo.png" alt="Face" width="20px"/></span> Facebook
          </button>
          <button className="signup-page__social-btn google-btn">
            <span className="icon"><img src="/Images/Gmail-logo.png" alt="Face" width="20px"/></span> Gmail
          </button>
        </div>

        {/* Enlace para regresar al login */}
        <div className="signup-page__login">
          <span>Already have an account?</span>
          <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
