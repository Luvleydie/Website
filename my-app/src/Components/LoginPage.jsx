import React from "react";
import { useNavigate } from "react-router-dom"; // Importa el hook useNavigate
import "./Styles/LoginPage.scss";

const LoginPage = () => {
  // Inicializa el hook para navegar
  const navigate = useNavigate();

  // Función que regresa a la homepage
  const handleBack = () => {
    navigate("/"); // Navega a la ruta "/"
  };

  return (
    <div className="login-page">
      {/* Botón flecha para volver a homepage */}
      <button className="login-page__back" onClick={handleBack}>
        <span className="arrow-left">◀</span>
      </button>
      {/* Contenedor principal */}
      <div className="login-page__card">
        {/* Logo en la parte superior */}
        <div className="login-page__logo">
          <img
            src="Images/Logo.png"
            alt="Alma-zen logo"
          />
        </div>

        <h2 className="login-page__title">Sign in to Alma-zen</h2>

        {/* Inputs */}
        <div className="login-page__form">
          <label className="login-page__label">
            User
            <input type="text" placeholder="Enter your user" />
          </label>

          <label className="login-page__label">
            Password
            <input type="password" placeholder="••••••••" />
          </label>

          <div className="login-page__forgot">
            <a href="#!">Forgot password?</a>
          </div>
        </div>

        {/* Botón Sign In */}
        <button className="login-page__signin-btn">Sign In</button>

        {/* “New to Alma-zen?” */}
        <div className="login-page__signup">
          <span>New to Alma-zen?</span>
          <a href="/signup">Create Account</a>
          </div>

        {/* Opciones de login con Facebook / Google (basado en tu imagen) */}
        <div className="login-page__social">
          <button className="login-page__social-btn facebook-btn">
            <span className="icon"><img src="/images/Facebook-logo.png" alt="facebook" width="20px"/></span> Facebook
          </button>
          <button className="login-page__social-btn google-btn">
            <span className="icon"><img src="/images/Gmail-logo.png" alt="Gmail" width="20px"/></span> Gmail
          </button>
        </div>
      </div>

      {/* Footer con enlaces */}
      <footer className="login-page__footer">
        <a href="#!">Terms</a>
        <a href="#!">Privacy</a>
        <a href="#!">Docs</a>
        <a href="#!">Contact Alma - Zen Support</a>
        <a href="#!">Manage cookies</a>
      </footer>
    </div>
  );
};

export default LoginPage;
