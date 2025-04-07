import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Styles/LoginPage.scss";

const LoginPage = () => {
  const navigate = useNavigate();

  // Si ya hay sesión iniciada, redirige al perfil
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/profile");
    }
  }, [navigate]);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
        toast.success("Inicio de sesión exitoso!");
        setTimeout(() => {
          navigate("/profile");
        }, 1500);
      } else {
        toast.error(data.error || "Error en el inicio de sesión");
      }
    } catch (err) {
      console.error("Error en login:", err);
      toast.error("Error en el inicio de sesión");
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="login-page">
      <ToastContainer />
      <button className="login-page__back" onClick={handleBack}>
        <span className="arrow-left">◀</span>
      </button>
      <div className="login-page__card">
        <div className="login-page__logo">
          <img src="./Images/fudtrack.png" alt="Fudtrack logo" />
        </div>
        <h2 className="login-page__title">Log in</h2>
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
            </span>
            Sign in with Facebook
          </button>
          <button className="login-page__social-btn google-btn">
            <span className="icon">
              <img src="./Images/Gmail-logo.png" alt="Gmail" width="20px" />
            </span>
            Sign in with Gmail
          </button>
        </div>
        <div className="login-page__signup">
          <span>New to Fudtrack?</span>
          <Link to="/signup">Create Account</Link>
        </div>
      </div>
      <footer className="login-page__footer">
        <a href="#!">Terms</a>
        <a href="#!">Privacy</a>
        <a href="#!">Docs</a>
        <a href="#!">Contact Fudtrack</a>
        <a href="#!">Manage cookies</a>
      </footer>
    </div>
  );
};

export default LoginPage;
