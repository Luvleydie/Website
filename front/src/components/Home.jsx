import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Animaciones optimizadas
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const Home = () => {
  return (
    <main className="relative flex justify-center items-center min-h-screen bg-gray-900">
      {/* Fondo con opacidad y difuminado */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50"
        style={{ backgroundImage: "url('/assets/bg-restaurant.jpg')" }}
      ></div>

      <section className="relative container mx-auto text-center px-4">
        <motion.article
          className="bg-white bg-opacity-90 backdrop-blur-md shadow-2xl p-12 rounded-3xl max-w-lg mx-auto transform transition duration-300 hover:shadow-2xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          role="region"
          aria-labelledby="home-title"
        >
          <motion.h2
            id="home-title"
            className="text-4xl font-bold text-gray-800"
            variants={fadeInUp}
          >
            Bienvenido a <span className="text-blue-600">Alma-zen</span>
          </motion.h2>

          <motion.p
            className="text-lg text-gray-600 mt-4 leading-relaxed"
            variants={fadeInUp}
          >
            Sistema de control de inventario para el restaurante{" "}
            <strong>Playa Azul</strong>.
          </motion.p>

          <motion.div variants={fadeInUp}>
            <Link
              to="/inventory"
              className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-blue-700 hover:shadow-xl transition focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-offset-2"
              aria-label="Ver Inventario"
              whileHover={{ scale: 1.05 }}
            >
              Ver Inventario
            </Link>
          </motion.div>
        </motion.article>
      </section>
    </main>
  );
};

export default Home;
