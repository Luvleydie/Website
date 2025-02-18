import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Styles/PaymentPage.scss";

const PaymentPage = () => {
    const navigate = useNavigate();
  
    // Estados para los campos de la tarjeta
    const [cardNumber, setCardNumber] = useState("");
    const [nameOnCard, setNameOnCard] = useState("");
    const [cvv, setCvv] = useState("");
    const [expiry, setExpiry] = useState("");
  
    // Regresar a la página principal (o donde prefieras)
    const handleBack = () => {
      navigate("/");
    };
  
    // Limpieza y formateo del número de tarjeta
    const handleCardNumberChange = (e) => {
      let value = e.target.value.replace(/\D/g, ""); // Solo dígitos
      value = value.slice(0, 16); // Máx. 16 dígitos
      setCardNumber(value);
    };
  
    // Espaciado cada 4 dígitos
    const formatCardNumber = (raw) => {
      if (!raw) return "0000 0000 0000 0000"; // Placeholder
      const groups = raw.match(/.{1,4}/g);
      return groups ? groups.join(" ") : raw;
    };
  
    return (
      <div className="payment-page">
        {/* Flecha para volver */}
        <button className="payment-page__back" onClick={handleBack}>
          <span className="arrow-left">◀</span>
        </button>
  
        {/* Logo Alma - Zen (opcional) */}
        <div className="payment-page__brand">
          <img
            src="/Images/Logo.png"
            alt="ALMA - ZEN Logo"
          />
        </div>
  
        {/* Tarjeta */}
        <div className="payment-page__card">
          <h3 className="payment-page__plan">Medium</h3>
  
          <div className="payment-page__chip">
            <img
              src="/Images/Chip.jpg"
              alt="Card Chip"
            />
          </div>
  
          {/* Número de tarjeta (mostrado formateado) */}
          <div className="payment-page__number">
            {formatCardNumber(cardNumber)}
          </div>
  
          <div className="payment-page__divider"></div>
  
          {/* Inputs dentro de la tarjeta */}
          <div className="payment-page__inputs">
            {/* Número de tarjeta */}
            <input
              type="text"
              placeholder="Card Number"
              value={formatCardNumber(cardNumber)}
              onChange={handleCardNumberChange}
              maxLength={19} // 16 dígitos + 3 espacios
            />
  
            {/* Nombre en la tarjeta */}
            <input
              type="text"
              placeholder="Name on Card"
              value={nameOnCard}
              onChange={(e) => setNameOnCard(e.target.value)}
              maxLength={30}
            />
  
            {/* CVV */}
            <input
              type="text"
              placeholder="CVV"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              maxLength={4}
            />
  
            {/* Expiración (MM/AA) */}
            <input
              type="text"
              placeholder="MM/AA"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              maxLength={5}
            />
          </div>
  
          {/* Botón Confirm */}
          <button className="payment-page__confirm">Confirm</button>
        </div>
  
        {/* Footer con enlace para crear cuenta (opcional) */}
        <div className="payment-page__footer">
          <p>No user?</p>
          <Link to="/signup">Create Account</Link>
        </div>
      </div>
    );
  };
  
  export default PaymentPage;
