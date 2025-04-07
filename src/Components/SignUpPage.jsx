import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Styles/SignUpPage.scss";

const SignUpPage = () => {
  const navigate = useNavigate();

  // Si ya hay sesión iniciada, redirige al perfil
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/profile");
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          phone: formData.phone
        })
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Registro exitoso");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error(data.error || "Error en el registro");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error en el registro");
    }
  };

  const handleBack = () => {
    navigate("/login");
  };

  return (
    <div className="signup-page">
      <ToastContainer />
      <button className="login-page__back" onClick={handleBack}>
        <span className="arrow-left">◀</span>
      </button>

      <div className="signup-page__left">
        <img src="Images/Worker.png" alt="Warehouse with inventory" />
        <div className="signup-page__overlay">
          {/* Texto o imagen de fondo opcional */}
        </div>
      </div>

      <div className="signup-page__right">
        <div className="signup-page__logo">
          <img src="Images/fudtrack.png" alt="Fudtrack logo" />
        </div>
        <h2 className="signup-page__title">Create your account</h2>

        <form className="signup-page__form" onSubmit={handleSubmit}>
          <label>
            Username
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Confirm Password
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Phone Number
            <input
              type="tel"
              name="phone"
              placeholder="e.g. +51 618 274 3609"
              onChange={handleChange}
            />
          </label>
          <button type="submit" className="signup-page__main-btn">
            Sign Up
          </button>
        </form>

        <div className="signup-page__social">
          <button className="signup-page__social-btn facebook-btn">
            <span className="icon">
              <img src="/Images/Facebook-logo.png" alt="Facebook" width="20px" />
            </span>{" "}
            Facebook
          </button>
          <button className="signup-page__social-btn google-btn">
            <span className="icon">
              <img src="/Images/Gmail-logo.png" alt="Gmail" width="20px" />
            </span>{" "}
            Gmail
          </button>
        </div>

        <div className="signup-page__login">
          <span>Already have an account?</span>
          <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
