import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './App.css';

const Home = () => {
  return (
    <div className="relative h-screen">
      {/* Imagen de fondo con overlay */}
      <div className="absolute inset-0">
        <img
          src="https://source.unsplash.com/1600x900/?restaurant,sea"
          alt="Fondo de restaurante Playa Azul"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-60"></div>
      </div>
      {/* Contenido principal centrado */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white">Alma-zen</h1>
        <p className="mt-4 text-lg md:text-2xl text-gray-200">
          Control de Inventario para el Restaurante Playa Azul
        </p>
        <NavLink
          to="/inventory"
          className="mt-8 inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium rounded-md transition-colors"
        >
          Ver Inventario
        </NavLink>
      </div>
    </div>
  );
};

const Inventory = () => {
  // Estado para almacenar los ítems obtenidos desde el JSON
  const [items, setItems] = useState([]);

  // Se obtiene la información al montar el componente
  useEffect(() => {
    fetch('/data/control_inventario.json')
      .then(response => response.json())
      .then(data => {
        console.log('Datos recibidos del JSON:', data); // Depuración
        // Se asume que el JSON tiene la propiedad "barra" con la lista de productos
        setItems(data.barra);
      })
      .catch(error => console.error('Error al obtener datos:', error));
  }, []);

  return (
    <div className="inventory-container p-4">
      <h2 className="text-2xl font-bold mb-4">Barra</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="w-1/12 py-2 px-4">Código</th>
              <th className="w-2/12 py-2 px-4">Descripción</th>
              <th className="w-2/12 py-2 px-4">Categoría</th>
              <th className="w-2/12 py-2 px-4">Almacén</th>
              <th className="w-2/12 py-2 px-4">Proveedor</th>
              <th className="w-1/12 py-2 px-4">UDM</th>
              <th className="w-1/12 py-2 px-4">Entrada</th>
              <th className="w-1/12 py-2 px-4">Stock</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.CODIGO} className="text-center border-b">
                <td className="py-2 px-4">{item.CODIGO}</td>
                <td className="py-2 px-4">{item.DESCRIPCION}</td>
                <td className="py-2 px-4">{item.CATEGORIA}</td>
                <td className="py-2 px-4">{item.ALMACEN}</td>
                <td className="py-2 px-4">{item.PROVEEDOR}</td>
                <td className="py-2 px-4">{item.UDM}</td>
                <td className="py-2 px-4">{parseInt(item.ENTRADA, 10)}</td>
                <td className="py-2 px-4">{parseInt(item.STOCK, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Reports = () => (
  <div className="reports-container p-4">
    <h2 className="text-2xl font-bold mb-4">Reportes</h2>
    <p>Aquí se mostrarán los reportes del inventario.</p>
  </div>
);

const Contact = () => (
  <div className="contact-container p-4">
    <h2 className="text-2xl font-bold mb-4">Contacto</h2>
    <p>Correo: info@playaazul.com</p>
  </div>
);

const App = () => (
  <Router>
    <header className="bg-gray-900 p-4 flex items-center justify-between">
      <h1 className="text-white text-3xl font-bold">Alma-zen</h1>
      <nav>
        <NavLink to="/" className="text-white mx-2 hover:text-blue-400">
          Inicio
        </NavLink>
        <NavLink to="/inventory" className="text-white mx-2 hover:text-blue-400">
          Inventario
        </NavLink>
        <NavLink to="/reports" className="text-white mx-2 hover:text-blue-400">
          Reportes
        </NavLink>
        <NavLink to="/contact" className="text-white mx-2 hover:text-blue-400">
          Contacto
        </NavLink>
      </nav>
    </header>
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </main>
    <footer className="bg-gray-900 p-4 text-center text-white">
      <p>&copy; 2025 Playa Azul - Alma-zen</p>
    </footer>
  </Router>
);

export default App;
