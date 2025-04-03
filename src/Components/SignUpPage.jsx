import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Styles/SignUpPage.scss";

const SignUpPage = () => {
  const navigate = useNavigate();
  // Estado para el formulario de registro
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: ""
  });

  // Manejo de cambios en los inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Función de envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validación simple de contraseña
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    // Realiza una petición POST al endpoint de registro del backend
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
        alert("Registro exitoso");
        navigate("/login"); // Redirige al login
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error en el registro");
    }
  };

  // Función para regresar al login
  const handleBack = () => {
    navigate("/login");
  };

  return (
    <div className="signup-page">
      {/* Flecha en la parte superior izquierda para volver al login */}
      <button className="login-page__back" onClick={handleBack}>
        <span className="arrow-left">◀</span>
      </button>

      {/* Lado izquierdo: imagen y texto */}
      <div className="signup-page__left">
        <img src="Images/Worker.png" alt="Warehouse with inventory" />
        <div className="signup-page__overlay">
          <h2>
          </h2>
        </div>
      </div>

      {/* Lado derecho: formulario */}
      <div className="signup-page__right">
        <div className="signup-page__logo">
          <img src="Images/fudtrack.png" alt="Alma-zen logo" />
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
          {/* Botón principal */}
          <button type="submit" className="signup-page__main-btn">
            Sign Up
          </button>
        </form>

        {/* Botones de redes sociales */}
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
