import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Styles/ProfilePage.scss";

const ProfilePage = () => {
  const navigate = useNavigate();
  // Obtener el usuario almacenado (por ejemplo, después de iniciar sesión)
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};

  // Estado para el formulario del perfil
  const [formData, setFormData] = useState({
    username: storedUser.username || "",
    email: storedUser.email || "",
    phone: storedUser.phone || "",
    profileImage: storedUser.profileImage || ""
  });

  // Estado para la información de pago
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loadingPayment, setLoadingPayment] = useState(true);

  // Obtener la información de pago del usuario desde el backend
  useEffect(() => {
    const fetchPaymentInfo = async () => {
      if (storedUser._id) {
        try {
          const response = await fetch(`http://localhost:5000/api/payment?userId=${storedUser._id}`);
          const data = await response.json();
          if (response.ok) {
            setPaymentInfo(data.payment);
          } else {
            console.error(data.error);
          }
        } catch (err) {
          console.error("Error fetching payment info:", err);
        }
      }
      setLoadingPayment(false);
    };
    fetchPaymentInfo();
  }, [storedUser._id]);

  // Manejar cambios en los inputs de texto
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Permitir subir imagen desde el dispositivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, profileImage: reader.result });
    };
    reader.readAsDataURL(file);
  };

  // Enviar actualización del perfil al backend
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: storedUser._id,
          ...formData
        })
      });
      const data = await response.json();
      if (response.ok) {
        // Actualizar el usuario almacenado
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("Perfil actualizado exitosamente!");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error actualizando perfil:", error);
      alert("Error actualizando perfil");
    }
  };

  // Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Helper para formatear el número de tarjeta (si fuera necesario)
  const formatCardNumber = (raw) => {
    if (!raw) return "";
    const groups = raw.match(/.{1,4}/g);
    return groups ? groups.join(" ") : raw;
  };

  return (
    <div className="profile-page">
      <header className="profile-header">
        <button className="profile-back" onClick={() => navigate("/")}>
          ◀ Home
        </button>
        <h1>My Profile</h1>
        <button className="profile-logout" onClick={handleLogout}>
          Logout
        </button>
      </header>
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-image-section">
            <img
              src={formData.profileImage || "/images/default-profile.png"}
              alt="Profile"
              className="profile-image"
            />
            <div className="image-options">
              <label htmlFor="fileInput" className="upload-label">
                Upload from device
              </label>
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
              />
              <label htmlFor="profileImageUrl" className="upload-label">
                Or enter image URL
              </label>
              <input
                type="text"
                id="profileImageUrl"
                name="profileImage"
                placeholder="Enter image URL"
                value={formData.profileImage}
                onChange={handleChange}
                className="profile-image-input"
              />
            </div>
          </div>
          <form className="profile-form" onSubmit={handleUpdate}>
            <div className="form-group">
              <label>Username:</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number:</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="update-btn">
              Update Profile
            </button>
          </form>
        </div>
        {/* Sección para mostrar la información de la tarjeta de pago */}
        <div className="payment-info-section">
          {loadingPayment ? (
            <p>Loading payment info...</p>
          ) : paymentInfo ? (
            <div className="payment-card">
              <h3>Payment Information</h3>
              <p>
                <strong>Card Number:</strong>{" "}
                {paymentInfo.cardNumber ? formatCardNumber(paymentInfo.cardNumber) : ""}
              </p>
              <p>
                <strong>Name on Card:</strong> {paymentInfo.nameOnCard}
              </p>
              <p>
                <strong>Expiry:</strong> {paymentInfo.expiry}
              </p>
            </div>
          ) : (
            <button className="add-payment-btn" onClick={() => navigate("/payment")}>
              Add Payment Info
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
