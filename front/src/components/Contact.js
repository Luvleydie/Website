import React from 'react';

const Contact = () => {
  return (
    <div className="contact-container">
      <h2>Contacto</h2>
      <p>¿Tienes alguna duda o comentario? Contáctanos:</p>
      <ul>
        <li>Teléfono: <a href="tel:+123456789">+1 234 567 89</a></li>
        <li>Email: <a href="mailto:info@playaazul.com">info@playaazul.com</a></li>
      </ul>
      <p>Dirección: Av. Principal 123, Ciudad, País</p>
    </div>
  );
};

export default Contact;
