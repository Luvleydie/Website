import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import InstagramIcon from "./Icons/InstagramIcon"; 
import "./Styles/Homepage.scss";

const Homepage = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [activeServiceTab, setActiveServiceTab] = useState("Graphs");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Mostrar botón "scroll to top" al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`homepage ${isDarkMode ? "dark" : "light"}`}>
      {/* NAVIGATION */}
      <nav className="navbar">
        <div className="logo">
          <Link to="/">
            <img src="/images/Logo.png" alt="Logo Alma - Zen" />
          </Link>
        </div>

        <div className="nav-extra">
          <button className="theme-toggle" onClick={toggleTheme}></button>
        </div>

        <div className={`nav-links ${isMobileNavOpen ? "open" : ""}`}>
          {localStorage.getItem("authToken") ? (
            <Link to="/profile">Profile</Link>
          ) : (
            <>
              <Link to="/login">Log in</Link>
              <Link to="/signup">Sign-up</Link>
            </>
          )}

          <Link to="/Almacen">Start</Link>
          <a href="#prices">Prices</a>
          <a href="#about">About</a>
        </div>

        <div
          className="nav-toggle"
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
        >
          <span className="hamburger"></span>
          <span className="hamburger"></span>
          <span className="hamburger"></span>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="hero">
        <div className="hero__content">
          <h1>Track, Organize, and Grow.</h1>
          <p>
            An online platform designed to facilitate inventory control and
            management for any business.
          </p>
          <div className="hero__cta-buttons">
            <Link to="/Almacen" className="start-button">Start</Link>
            <Link to="/terms" className="learn-more-button">
              Learn More
            </Link>
          </div>
        </div>

        {/* Reemplazamos la imagen de Dashboard por un mockup que simula el dashboard */}
        <div className="hero__image">
          <div className="hero__dashboard">
            {/* Barra lateral izquierda */}
            <div className="dashboard__left">
              <div className="dashboard__circle"></div>
            </div>

            {/* Panel derecho con "tarjetas" y estrellas */}
            <div className="dashboard__right">
              <div className="dashboard__item">
                <span className="star"></span>
              </div>
              <div className="dashboard__item">
                {/* sin estrella */}
              </div>
              <div className="dashboard__item">
                <span className="star"></span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* SERVICES SECTION */}
      <section id="services" className="services">
        <h2 className="services__title">Our Services</h2>
        <div className="services__tabs">
          {["Graphs", "Dashboard", "Text Message"].map((tab) => (
            <span
              key={tab}
              className={activeServiceTab === tab ? "active" : ""}
              onClick={() => setActiveServiceTab(tab)}
            >
              {tab}
            </span>
          ))}
        </div>
        <div className="services__content">
          <div className="services__image">
            <img src="/images/Graphs.jpg" alt="Service Preview" />
          </div>
          <div className="services__info">
            {activeServiceTab === "Graphs" && (
              <p>
                Effortlessly manage your inventory with our intuitive dashboard. You’ll find a comprehensive list of all products, where you can easily add items by entering their name and stock level. We’ll handle assigning IDs for you! Optionally, you can also upload an image to give a visual reference. Stay organized and keep track of everything seamlessly.
              </p>
            )}
            {activeServiceTab === "Dashboard" && (
              <p>
                Manage your inventory seamlessly with our comprehensive
                dashboard interface.
              </p>
            )}
            {activeServiceTab === "Text Message" && (
              <p>
                Receive real-time alerts and notifications via text messages to
                never miss a detail.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* PRICES SECTION */}
      <section id="prices" className="prices">
        <h2>Premium Plans</h2>
        <div className="prices__cards">
          <div className="prices__card prices__card--basic">
            <h3>MX$0</h3>
            <p>Per month</p>
            <h4>Basic</h4>
            <ul>
              <li>Limited products storage to 50 products</li>
              <li>Standard dashboard</li>
            </ul>
            <Link to="/login" className="prices__button">
              Start
            </Link>
          </div>
          <div className="prices__card prices__card--medium">
            <h3>MX$199</h3>
            <p>Per month</p>
            <h4>Medium</h4>
            <ul>
              <li>Limited products storage to 300 products</li>
              <li>Graphs</li>
              <li>Standard dashboard</li>
            </ul>
            <Link to="/payment" className="prices__button">
              Subscribe
            </Link>
          </div>
          <div className="prices__card prices__card--premium">
            <h3>MX$499</h3>
            <p>Per month</p>
            <h4>Premium</h4>
            <ul>
              <li>Limited products storage to 1000 products</li>
              <li>All graphs unlocked</li>
              <li>Professional dashboard</li>
            </ul>
            <Link to="/payment" className="prices__button">
              Subscribe
            </Link>
          </div>
        </div>
      </section>

      {/* ABOUT US SECTION */}
      <section id="about" className="about">
        <h2>About us</h2>
        <div className="about__content">
          <div className="about__text">
            <p>
            At Alma - zen, we specialize in providing efficient solutions for inventory management. Our goal is to help companies and entrepreneurs optimize the control of their products, reduce losses and improve decision making with advanced and easy-to-use technology.
            </p>
            <p>
            We are committed to offering a reliable, safe and adaptable service to the needs of each business. With us your <strong>inventory management will improve to the next level!</strong>
            </p>
          </div>
          <div className="about__image">
            <img src="/images/workers.jpg" alt="Our Team at Work" />
          </div>
        </div>
      </section>

      {/* CONTACT US SECTION */}
      <section id="contact" className="contact">
        <h2>Contact Us</h2>
        <div className="contact__container">
          <div className="contact__left">
            <div className="contact__input">
              <input type="email" placeholder="example@domain.com" />
              <button>Send</button>
            </div>
            <p>Tel. 618 777 8888</p>
            <button className="contact__lang-button">English</button>
            <p className="contact__copy">Alma - Zen © 2025 - 20XX</p>
          </div>
          <div className="contact__right">
            <ul>
            <li>
                <Link to="/Terms">Terms</Link>
              </li>
              <li>
                <a href="#!">Privacy</a>
              </li>
              <li>
                <a href="#!">Docs</a>
              </li>
              <li>
                <a href="#!">Support</a>
              </li>
              <li>
                <a href="#!">Cookies</a>
              </li>
            </ul>
            <div className="contact__icons">
              <a
                href="https://www.instagram.com/luvleydie"
                target="_blank"
                rel="noopener noreferrer"
                className="icon icon--instagram"
                aria-label="Instagram"
              >
                <InstagramIcon size={32} />
              </a>
              <a
                href="https://www.twitter.com/yourprofile"
                target="_blank"
                rel="noopener noreferrer"
                className="icon icon--twitter"
                aria-label="Twitter"
              ></a>
              <a
                href="https://www.tiktok.com/@yourprofile"
                target="_blank"
                rel="noopener noreferrer"
                className="icon icon--tiktok"
                aria-label="TikTok"
              ></a>
            </div>
          </div>
        </div>
      </section>

      {/* SCROLL TO TOP BUTTON */}
      {showScrollTop && (
        <button className="scroll-top" onClick={scrollToTop}>
          ↑
        </button>
      )}
    </div>
  );
};

export default Homepage;
