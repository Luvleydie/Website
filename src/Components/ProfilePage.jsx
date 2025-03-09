import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Styles/ProfilePage.scss";

const ProfilePage = () => {
  const navigate = useNavigate();
  // Obtener el usuario desde localStorage
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  
  const [formData, setFormData] = useState({
    username: storedUser.username || "",
    email: storedUser.email || "",
    phone: storedUser.phone || "",
    profileImage: storedUser.profileImage || ""
  });

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  // Enviar actualización al backend
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
      if(response.ok) {
        // Actualizamos el usuario en localStorage
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("Profile updated successfully!");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error updating profile", error);
      alert("Error updating profile");
    }
  };

  // Cerrar sesión y volver al login
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <button className="profile-back" onClick={() => navigate("/")}>
          ◀ Home
        </button>
        <h2>Your Profile</h2>
        <button className="profile-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="profile-card">
        <div className="profile-image-section">
          <img
            src={formData.profileImage || "/images/default-profile.png"}
            alt="Profile"
            className="profile-image"
          />
          <label htmlFor="profileImageInput" className="upload-label">
            Change Photo (URL)
          </label>
          <input
            type="text"
            id="profileImageInput"
            name="profileImage"
            placeholder="Enter image URL"
            value={formData.profileImage}
            onChange={handleChange}
            className="profile-image-input"
          />
        </div>
        <form className="profile-form" onSubmit={handleUpdate}>
          <label>
            Username:
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Phone Number:
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </label>
          <button type="submit" className="update-btn">
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
