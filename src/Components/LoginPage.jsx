import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Styles/LoginPage.scss";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  // Estado para el formulario de login
  const [formData, setFormData] = useState({ email: "", password: "" });

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Función para enviar el formulario de login
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        // Guardar token y usuario, por ejemplo, en localStorage
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/profile"); // Redirigir al perfil o a la homepage
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error en el inicio de sesión");
    }
  };

  // Función para regresar a la homepage
  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="login-page">
      {/* Botón flecha para volver a homepage */}
      <button className="login-page__back" onClick={handleBack}>
        <span className="arrow-left">◀</span>
      </button>
      <div className="login-page__card">
        {/* Logo en la parte superior */}
        <div className="login-page__logo">
          <img src="./Images/Logo.png" alt="Alma-zen logo" />
        </div>

        <h2 className="login-page__title">Sign in</h2>

        {/* Formulario */}
        <form className="login-page__form" onSubmit={handleSubmit}>
          <label className="login-page__label">
            Email
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              required
            />
          </label>
          <label className="login-page__label">
            Password
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </label>
          <button type="submit" className="login-page__signin-btn">
            Log in
          </button>
        </form>

        <div className="login-page__social">
          <button className="login-page__social-btn facebook-btn">
            <span className="icon">
              <img src="./Images/Facebook-logo.png" alt="Facebook" width="20px" />
            </span>{" "}
            Facebook
          </button>
          <button className="login-page__social-btn google-btn">
            <span className="icon">
              <img src="./Images/Gmail-logo.png" alt="Gmail" width="20px" />
            </span>{" "}
            Gmail
          </button>
        </div>

        {/* Enlace para crear cuenta */}
        <div className="login-page__signup">
          <span>New to Alma-zen?</span>
          <Link to="/signup">Create Account</Link>
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
