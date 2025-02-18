import React, { useState } from "react"; // Importa useState
import { useNavigate } from "react-router-dom"; // Importa el hook useNavigate
import "./Styles/LoginPage.scss";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

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
            src="./Images/Logo.png" // Corrige la ruta de la imagen
            alt="Alma-zen logo"
          />
        </div>

        <h2 className="login-page__title">Sign in</h2>

        {/* Inputs */}
        <div className="login-page__form">
          <label className="login-page__label">
            User
            <input type="text" placeholder="Enter your user" />
          </label>
          <label className="login-page__label">
            Password
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </label>
        </div>

        {/* Botón Sign In */}
        <button className="login-page__signin-btn">Sign In</button>

        {/* Opciones de login con Facebook / Google */}
        <div className="login-page__social">
          <button className="login-page__social-btn facebook-btn">
            <span className="icon"><img src="./Images/Facebook-logo.png" alt="Facebook" width="20px"/></span> Facebook
          </button>
          <button className="login-page__social-btn google-btn">
            <span className="icon"><img src="./Images/Gmail-logo.png" alt="Gmail" width="20px"/></span> Gmail
          </button>
        </div>
        
        {/* “New to Alma-zen?” */}
        <div className="login-page__signup">
          <span>New to Alma-zen?</span>
          <a href="/signup">Create Account</a>
        </div>
      </div>

      {/* Footer con enlaces */}
      <footer className="login-page__footer">
        <a href="/signup">Terms</a>
        <a href="#!">Privacy</a>
        <a href="#!">Docs</a>
        <a href="#!">Contact Alma - Zen Support</a>
        <a href="#!">Manage cookies</a>
      </footer>
    </div>
  );
};

export default LoginPage;
