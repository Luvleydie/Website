import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const container = document.getElementById('root');
if (!container) {
  console.error('No se encontró el contenedor con id "root" en index.html');
} else {
  const root = ReactDOM.createRoot(container);
  root.render(<App />);
}
