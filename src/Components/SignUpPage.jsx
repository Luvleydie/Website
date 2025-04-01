import React from "react";
import { Link, useNavigate } from "react-router-dom";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";


import "./Styles/SignUpPage.scss";

const SignUpPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/login");
  };

  const responseFacebook = async (response) => {
    if (response.accessToken) {
      try {
        const backendResponse = await fetch("http://localhost:5000/api/auth/facebook", {
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
        const data = await backendResponse.json();
        if (backendResponse.ok) {
          // Guarda el token y el usuario, y redirige al perfil
          localStorage.setItem("authToken", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          navigate("/profile");
        } else {
          alert(data.error || "Error creando la cuenta con Facebook.");
        }
      } catch (err) {
        console.error("Error en autenticación con Facebook:", err);
        alert("Error conectando con el servidor.");
      }
    } else {
      alert("No se pudo autenticar con Facebook.");
    }
  };

  return (
    <div className="signup-page">
      <button className="signup-page__back" onClick={handleBack}>
        <span className="arrow-left">◀</span>
      </button>

      <div className="signup-page__left">
        <img src="/Images/Worker.png" alt="Warehouse with inventory" />
        <div className="signup-page__overlay">
          
        </div>
      </div>

      <div className="signup-page__right">
        <div className="signup-page__logo">
          <img src="/Images/Logo.png" alt="Alma‑Zen logo" />
        </div>
        <h2 className="signup-page__title">Create your account</h2>

        <form className="signup-page__form">
          <label>
            Username
            <input type="text" placeholder="Enter your username" required />
          </label>
          <label>
            Email
            <input type="email" placeholder="Enter your email" required />
          </label>
          <label>
            Password
            <input type="password" placeholder="••••••••" required />
          </label>
          <label>
            Confirm Password
            <input type="password" placeholder="••••••••" required />
          </label>
          <label>
            Phone Number
            <input type="tel" placeholder="e.g. +51 618 274 3609" />
          </label>
          <button type="submit" className="signup-page__main-btn">
            Sign Up
          </button>
        </form>

        <div className="signup-page__social">
          <FacebookLogin
            appId="YOUR_FACEBOOK_APP_ID" 
            autoLoad={false}
            callback={responseFacebook}
            fields="name,email,picture"
            render={(renderProps) => (
              <button
                className="signup-page__social-btn facebook-btn"
                onClick={renderProps.onClick}
              >
                <span className="icon">
                  <img
                    src="/Images/Facebook-logo.png"
                    alt="Facebook"
                    width="20px"
                  />
                </span>
                Sign up with Facebook
              </button>
            )}
          />
          <button className="signup-page__social-btn google-btn">
            <span className="icon">
              <img
                src="/Images/Gmail-logo.png"
                alt="Gmail"
                width="20px"
              />
            </span>
            Sign up with Gmail
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
