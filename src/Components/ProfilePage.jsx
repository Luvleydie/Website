import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Styles/ProfilePage.scss";

const ProfilePage = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};

  // Estado del perfil
  const [formData, setFormData] = useState({
    username: storedUser.username || "",
    email: storedUser.email || "",
    phone: storedUser.phone || "",
    profileImage: storedUser.profileImage || ""
  });

  // Estado para la información de pago
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loadingPayment, setLoadingPayment] = useState(true);
  const [editingPayment, setEditingPayment] = useState(false);
  const [paymentFormData, setPaymentFormData] = useState({
    cardNumber: "",
    nameOnCard: "",
    expiry: ""
  });

  // Estado para cambio de contraseña
  const [editingPassword, setEditingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });

  // Notificación para informar cambios
  const [notification, setNotification] = useState("");

  // Cargar información de pago desde el backend
  useEffect(() => {
    const fetchPaymentInfo = async () => {
      if (storedUser._id) {
        try {
          // Asegúrate de usar backticks para formar la URL correctamente
          const response = await fetch(`http://localhost:5000/api/payment?userId=${storedUser._id}`);
          const data = await response.json();
          console.log("Respuesta del endpoint de payment:", data);
          if (response.ok && data.payment) {
            setPaymentInfo(data.payment);
            setPaymentFormData({
              cardNumber: data.payment.cardNumber || "",
              nameOnCard: data.payment.nameOnCard || "",
              expiry: data.payment.expiry || ""
            });
          } else {
            console.error("Error en la respuesta de payment:", data.error);
          }
        } catch (err) {
          console.error("Error fetching payment info:", err);
        }
      } else {
        console.error("No se encontró storedUser._id");
      }
      setLoadingPayment(false);
    };

    fetchPaymentInfo();
  }, [storedUser._id]);

  // Manejo de cambios en el formulario del perfil
  const handleProfileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Manejo de cambio de imagen de perfil
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, profileImage: reader.result });
    };
    reader.readAsDataURL(file);
  };

  // Actualizar perfil
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: storedUser._id, ...formData })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setNotification("Perfil actualizado exitosamente!");
      } else {
        setNotification(data.error || "Error actualizando perfil");
      }
    } catch (error) {
      console.error("Error actualizando perfil:", error);
      setNotification("Error actualizando perfil");
    }
  };

  // Manejar cambios en el formulario de pago
  const handlePaymentChange = (e) => {
    setPaymentFormData({ ...paymentFormData, [e.target.name]: e.target.value });
  };

  // Actualizar información de pago
  const handleUpdatePayment = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/payment", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: storedUser._id, ...paymentFormData })
      });
      const data = await response.json();
      if (response.ok) {
        setPaymentInfo(data.payment);
        setEditingPayment(false);
        setNotification("Información de pago actualizada correctamente!");
      } else {
        setNotification(data.error || "Error actualizando la información de pago");
      }
    } catch (err) {
      console.error("Error updating payment info:", err);
      setNotification("Error actualizando la información de pago");
    }
  };

  // Manejar cambios en el formulario de contraseña
  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  // Actualizar contraseña
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setNotification("La nueva contraseña y su confirmación no coinciden.");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/auth/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: storedUser._id,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });
      const data = await response.json();
      if (response.ok) {
        setEditingPassword(false);
        setPasswordData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
        setNotification("Contraseña actualizada exitosamente!");
      } else {
        setNotification(data.error || "Error actualizando la contraseña");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setNotification("Error actualizando la contraseña");
    }
  };

  // Eliminar cuenta
  const handleDeleteAccount = async () => {
    if (window.confirm("¿Está seguro de que desea eliminar su cuenta? Esta acción es irreversible.")) {
      try {
        const response = await fetch(`http://localhost:5000/api/auth/delete-account?userId=${storedUser._id}`, {
          method: "DELETE"
        });
        const data = await response.json();
        if (response.ok) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          navigate("/signup");
        } else {
          setNotification(data.error || "Error eliminando la cuenta");
        }
      } catch (err) {
        console.error("Error deleting account:", err);
        setNotification("Error eliminando la cuenta");
      }
    }
  };

  // Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Helper para formatear el número de tarjeta
  const formatCardNumber = (raw) => {
    if (!raw) return "";
    const groups = raw.match(/.{1,4}/g);
    return groups ? groups.join(" ") : raw;
  };

  return (
    <div className="profile-page fade-in">
      <header className="profile-header">
        <button className="profile-back" onClick={() => navigate("/")}>
          ◀ Home
        </button>
        <h1>My Profile</h1>
        <button className="profile-logout" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {notification && <div className="notification">{notification}</div>}

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
                onChange={handleProfileChange}
                className="profile-image-input"
              />
            </div>
          </div>
          <form className="profile-form" onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label>Username:</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleProfileChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleProfileChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number:</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleProfileChange}
              />
            </div>
            <button type="submit" className="update-btn">
              Update Profile
            </button>
          </form>
        </div>

        {/* Payment Info Section */}
        <div className="payment-info-section">
          {loadingPayment ? (
            <p>Loading payment info...</p>
          ) : (
            <>
              {paymentInfo && !editingPayment ? (
                <div className="payment-card">
                  <h3>Payment Information</h3>
                  <p>
                    <strong>Card Number:</strong>{" "}
                    {paymentInfo.cardNumber ? formatCardNumber(paymentInfo.cardNumber) : "N/A"}
                  </p>
                  <p>
                    <strong>Name on Card:</strong> {paymentInfo.nameOnCard || "N/A"}
                  </p>
                  <p>
                    <strong>Expiry:</strong> {paymentInfo.expiry || "N/A"}
                  </p>
                  <button className="edit-btn" onClick={() => setEditingPayment(true)}>
                    Edit Payment Info
                  </button>
                </div>
              ) : (
                <form className="payment-form" onSubmit={handleUpdatePayment}>
                  <h3>{paymentInfo ? "Edit Payment Information" : "Add Payment Information"}</h3>
                  <div className="form-group">
                    <label>Card Number:</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={paymentFormData.cardNumber}
                      onChange={handlePaymentChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Name on Card:</label>
                    <input
                      type="text"
                      name="nameOnCard"
                      value={paymentFormData.nameOnCard}
                      onChange={handlePaymentChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Expiry (MM/YY):</label>
                    <input
                      type="text"
                      name="expiry"
                      value={paymentFormData.expiry}
                      onChange={handlePaymentChange}
                      required
                    />
                  </div>
                  <button type="submit" className="update-btn">
                    Save Payment Info
                  </button>
                  {paymentInfo && (
                    <button type="button" className="cancel-btn" onClick={() => setEditingPayment(false)}>
                      Cancel
                    </button>
                  )}
                </form>
              )}
              {!paymentInfo && !editingPayment && (
                <button className="add-payment-btn" onClick={() => setEditingPayment(true)}>
                  Add Payment Info
                </button>
              )}
            </>
          )}
        </div>

        {/* Password Change Section */}
        <div className="password-section">
          {editingPassword ? (
            <form className="password-form" onSubmit={handleUpdatePassword}>
              <h3>Change Password</h3>
              <div className="form-group">
                <label>Current Password:</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>New Password:</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password:</label>
                <input
                  type="password"
                  name="confirmNewPassword"
                  value={passwordData.confirmNewPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <button type="submit" className="update-btn">
                Update Password
              </button>
              <button type="button" className="cancel-btn" onClick={() => setEditingPassword(false)}>
                Cancel
              </button>
            </form>
          ) : (
            <button className="edit-btn" onClick={() => setEditingPassword(true)}>
              Change Password
            </button>
          )}
        </div>

        {/* Delete Account Section */}
        <div className="delete-account-section">
          <button
            className="delete-account-btn"
            onClick={() => {
              if (window.confirm("¿Está seguro de que desea eliminar su cuenta? Esta acción es irreversible.")) {
                handleDeleteAccount();
              }
            }}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
