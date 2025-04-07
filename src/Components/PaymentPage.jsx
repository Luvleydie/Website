import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Styles/PaymentPage.scss";

const PaymentPage = () => {
  const navigate = useNavigate();

  // Verificar que el usuario esté autenticado
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // Obtener datos del usuario autenticado
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};

  // Estados para los campos de la tarjeta
  const [cardNumber, setCardNumber] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiry, setExpiry] = useState("");

  // Limpieza y formateo del número de tarjeta
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Solo dígitos
    value = value.slice(0, 16); // Máx. 16 dígitos
    setCardNumber(value);
  };

  // Formatear el número de tarjeta (agrupa cada 4 dígitos)
  const formatCardNumber = (raw) => {
    const groups = raw.match(/.{1,4}/g);
    return groups ? groups.join(" ") : raw;
  };

  // Función para enviar los datos de pago al backend
  const handleConfirm = async () => {
    // Verificar que se encuentre el usuario (userId)
    if (!storedUser._id) {
      alert("Usuario no encontrado. Por favor, inicia sesión nuevamente.");
      navigate("/login");
      return;
    }

    // Validar que se hayan ingresado todos los campos requeridos
    if (!cardNumber || cardNumber.length < 16 || !nameOnCard || !cvv || !expiry) {
      alert("Por favor, ingresa todos los datos válidos (número de tarjeta de 16 dígitos, nombre, CVV y fecha de expiración).");
      return;
    }

    const paymentData = {
      cardNumber,
      nameOnCard,
      cvv,
      expiry,
      userId: storedUser._id, // Asociar el pago al usuario autenticado
    };

    console.log("Enviando paymentData:", paymentData);

    try {
      const response = await fetch("http://localhost:5000/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Detalles de pago guardados exitosamente!");
        // Redirigir al perfil para ver la información de pago
        navigate("/profile");
      } else {
        console.error("Error del backend:", data.error);
        alert(data.error || "Error guardando los detalles de pago.");
      }
    } catch (error) {
      console.error("Error guardando los detalles de pago:", error);
      alert("Error guardando los detalles de pago.");
    }
  };

  // Función para regresar al homepage
  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="payment-page">
      {/* Botón para volver al homepage */}
      <button className="payment-page__back" onClick={handleBack}>
        <span className="arrow-left">◀</span>
      </button>

      {/* Logo */}
      <div className="payment-page__brand">
        <img src="/Images/Logo.png" alt="ALMA - ZEN Logo" />
      </div>

      {/* Top right: Foto de perfil pequeña */}
      <div className="payment-page__profile">
        <img
          src={storedUser.profileImage || "/images/default-profile.png"}
          alt="Profile"
          className="profile-thumbnail"
          onClick={() => navigate("/profile")}
        />
      </div>

      {/* Tarjeta de pago */}
      <div className="payment-page__card">
        <h3 className="payment-page__plan">Enter Payment Details</h3>
        <div className="payment-page__chip">
          <img src="/Images/Chip4.png" alt="Card Chip" />
        </div>
        <div className="payment-page__number">{formatCardNumber(cardNumber)}</div>
        <div className="payment-page__divider"></div>
        <div className="payment-page__inputs">
          <input
            type="text"
            placeholder="Card Number"
            value={formatCardNumber(cardNumber)}
            onChange={handleCardNumberChange}
            maxLength={19} // 16 dígitos + espacios
          />
          <input
            type="text"
            placeholder="Name on Card"
            value={nameOnCard}
            onChange={(e) => setNameOnCard(e.target.value)}
            maxLength={30}
          />
          <input
            type="text"
            placeholder="CVV"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            maxLength={4}
          />
          <input
            type="text"
            placeholder="Expiry (MM/YY)"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            maxLength={5}
          />
        </div>
        <button className="payment-page__confirm" onClick={handleConfirm}>
          Confirm
        </button>
      </div>

      {/* Footer con enlace para crear cuenta */}
      <div className="payment-page__footer">
        <p>No user?</p>
        <Link to="/signup">Create Account</Link>
      </div>
    </div>
  );
};

export default PaymentPage;
