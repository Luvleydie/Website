import React, { useState } from "react";
import Navbar from "./Navbar"; // Asegúrate de que esta importación esté correcta
import "./Styles/Terms.scss"; // Asegúrate de que el archivo SCSS esté correctamente importado

const Terms = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="terms-container">
      {/* Importamos el Navbar */}
      <Navbar
        isMobileNavOpen={isMobileNavOpen}
        toggleMobileNav={() => setIsMobileNavOpen(!isMobileNavOpen)}
      />

      <div className="terms-content">
        <h1>Terms and Conditions</h1>
        <p>
          Welcome to our website. By accessing or using this website, you agree
          to comply with and be bound by the following terms and conditions. If
          you do not agree with these terms, you should not use this website.
        </p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using this website, you accept and agree to be bound
          by these terms and conditions. These terms may be updated or modified
          from time to time, and it is your responsibility to review them
          regularly.
        </p>

        <h2>2. Use of Website</h2>
        <p>
          You agree to use this website for lawful purposes only. You shall not
          use the website in any way that violates any applicable laws or
          regulations, or that could harm or disrupt the website’s
          functionality.
        </p>

        <h2>3. Privacy Policy</h2>
        <p>
          Your privacy is important to us. Please refer to our Privacy Policy to
          understand how we collect, use, and protect your personal information.
        </p>

        <h2>4. User Content</h2>
        <p>
          You may be able to submit, post, or share content on our website. By
          doing so, you grant us a non-exclusive, royalty-free license to use,
          display, and distribute such content as part of the services provided
          on the website.
        </p>

        <h2>5. Limitation of Liability</h2>
        <p>
          In no event shall we be liable for any damages arising out of or in
          connection with the use of this website, including but not limited to
          direct, indirect, incidental, or consequential damages.
        </p>

        <h2>6. Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms and conditions at any time.
          Any changes will be effective immediately upon posting on this
          website. Please check this page regularly for updates.
        </p>

        <h2>7. Governing Law</h2>
        <p>
          These terms and conditions shall be governed by and construed in
          accordance with the laws of the jurisdiction in which we are located,
          without regard to its conflict of law provisions.
        </p>

        <h2>8. Contact Information</h2>
        <p>
          If you have any questions or concerns about these terms and
          conditions, please contact us at support@almazen.com.
        </p>
      </div>
    </div>
  );
};

export default Terms;
