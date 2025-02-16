import React from "react";
import "./Homepage.scss";

const Homepage = () => {
  return (
    <div className="homepage">
      {/* Navegación */}
      <nav className="navbar">
        <div className="logo">
        <img 
    src="/images/Logo.png" 
    alt="Workers checking inventory" 
    width= '34%'
  />
            </div>
        


        <ul className="nav-links">
          <li>
            <a href="#services">Service</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
          <li>
            <button className="login-button">Log in</button>
          </li>
        </ul>
      </nav>

      {/* Sección principal (Hero) */}
      <main className="hero">
        <div className="hero__content">
          <h1>Track, organize, and grow.</h1>
          <p>
            An online platform designed to facilitate inventory control and
            management in businesses of any size.
          </p>
          <button className="start-button">Start</button>
        </div>

        {/* Mockups / Ilustraciones */}
        <div className="hero__image">
          {/* Parte superior del mockup con gráficas de barras */}
          <div className="mockup mockup--top">
            <div className="mockup__barchart">
              <div className="bar bar--1"></div>
              <div className="bar bar--2"></div>
              <div className="bar bar--3"></div>
            </div>
            <div className="mockup__item"></div>
            <div className="mockup__item"></div>
          </div>

          {/* Parte inferior del mockup (3 gráficos de pastel) */}
          <div className="mockup mockup--bottom">
            <div className="mockup__chart mockup__chart--pie1"></div>
            <div className="mockup__chart mockup__chart--pie2"></div>
            <div className="mockup__chart mockup__chart--pie3"></div>
          </div>
        </div>
      </main>

      {/* Sección de Servicios */}
      <section id="services" className="services">
        <h2 className="services__title">Servicies</h2>

        <div className="services__tabs">
          <span className="active">Graphs</span>
          <span>Dashboard</span>
          <span>Text Message</span>
        </div>

        <div className="services__content">
          <div className="services__image">
            <img
              src="/images/Graphs.png"
              alt="Phone with bar chart"
              width='999px'
            />
          </div>
          <div className="services__info">
            <p>
              Effortlessly manage your inventory with our intuitive dashboard.
              You’ll find a comprehensive list of all products, where you can
              easily add items by entering their name and stock level.
            </p>
            <p>
              We’ll handle assigning IDs for you! Optionally, you can also upload
              an image to give a visual reference. Stay organized and keep track
              of everything seamlessly.
            </p>
          </div>
        </div>
      </section>

      {/* Sección de Precios */}
      <section id="prices" className="prices">
        <h2>Prices</h2>
        <div className="prices__cards">
          {/* Card 1: Basic */}
          <div className="prices__card prices__card--basic">
            <h3>MX$0</h3>
            <p>Per month</p>
            <h4>Basic</h4>
            <ul>
              <li>Limited products (100)</li>
              <li>Limited graphs</li>
              <li>Dashboard</li>
            </ul>
            <button className="prices__button">Start</button>
          </div>

          {/* Card 2: Medium */}
          <div className="prices__card prices__card--medium">
            <h3>MX$100</h3>
            <p>Per month</p>
            <h4>Medium</h4>
            <ul>
              <li>Limited products (500)</li>
              <li>Limited graphs</li>
              <li>Dashboard</li>
            </ul>
            <button className="prices__button">Subscribe</button>
          </div>

          {/* Card 3: Premium */}
          <div className="prices__card prices__card--premium">
            <h3>MX$200</h3>
            <p>Per month</p>
            <h4>Premium</h4>
            <ul>
              <li>Unlimited products</li>
              <li>Unlimited graphs</li>
              <li>Receive messages when a product is running low</li>
              <li>Can sync with multiple locations (same company)</li>
            </ul>
            <button className="prices__button">Subscribe</button>
          </div>
        </div>
      </section>

      {/* Sección About us */}
      <section id="about" className="about">
        <h2>About us</h2>
        <div className="about__content">
          <div className="about__text">
            <p>
              At Alma - zen, we specialize in providing efficient solutions for
              inventory management. Our goal is to help companies and entrepreneurs
              optimize the control of their products, reduce losses and improve
              decision making with advanced and easy-to-use technology.
            </p>
            <p>
              Our system allows real-time tracking, stock alerts, detailed reports
              and an intuitive interface that makes it easy to manage inventory from
              one place.
            </p>
            <p>
              We are committed to offering a reliable, safe and adaptable service to
              the needs of each business. Trust us to take your inventory management
              to the next level!
            </p>
          </div>
          <div className="about__image">
          <div className="about__image">
            <img 
            src="/images/workers.jpg" 
            alt="Workers checking inventory" 
            />
</div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
