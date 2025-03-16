import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import "./Styles/LoginPage.scss";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Login tradicional
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/profile");
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error("Error en login:", err);
      alert("Error en el inicio de sesión");
    }
  };

  // Callback de Facebook
  const responseFacebook = async (response) => {
    console.log("Respuesta de Facebook:", response); // Depuración
    if (response.accessToken) {
      try {
        const fbResponse = await fetch("http://localhost:5000/api/auth/facebookLogin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accessToken: response.accessToken,
            userID: response.userID,
            name: response.name,
            email: response.email,
            picture: response.picture?.data?.url,
          }),
        });
        const data = await fbResponse.json();
        if (fbResponse.ok) {
          localStorage.setItem("authToken", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          navigate("/profile");
        } else {
          alert(data.error || "Error al iniciar sesión con Facebook");
        }
      } catch (err) {
        console.error("Error autenticando con Facebook:", err);
        alert("Error conectando con el servidor de Facebook");
      }
    } else {
      alert("No se pudo autenticar con Facebook");
    }
  };

  // Función para regresar a homepage
  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="login-page">
      <button className="login-page__back" onClick={handleBack}>
        <span className="arrow-left">◀</span>
      </button>
      <div className="login-page__card">
        <div className="login-page__logo">
          <img src="./Images/Logo.png" alt="Alma-zen logo" />
        </div>
        <h2 className="login-page__title">Sign in</h2>
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
          <FacebookLogin
            appId="YOUR_FACEBOOK_APP_ID" // Reemplaza con tu Facebook App ID real
            autoLoad={false}
            callback={responseFacebook}
            fields="name,email,picture"
            render={(renderProps) => (
              <button
                className="login-page__social-btn facebook-btn"
                onClick={renderProps.onClick}
              >
                <span className="icon">
                  <img src="./Images/Facebook-logo.png" alt="Facebook" width="20px" />
                </span>{" "}
                Sign in with Facebook
              </button>
            )}
          />
          <button className="login-page__social-btn google-btn">
            <span className="icon">
              <img src="./Images/Gmail-logo.png" alt="Gmail" width="20px" />
            </span>{" "}
            Sign in with Gmail
          </button>
        </div>
        <div className="login-page__signup">
          <span>New to Alma-zen?</span>
          <Link to="/signup">Create Account</Link>
        </div>
      </div>
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
