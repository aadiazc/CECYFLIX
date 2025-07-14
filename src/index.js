import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Si tienes un archivo CSS global para tu aplicación
import App from './App'; // Importa tu componente principal App.js

// Crea la raíz de tu aplicación React.
// 'root' es el ID del div en tu archivo public/index.html donde se montará la aplicación.
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderiza tu componente principal (App) dentro del modo estricto de React.
// El modo estricto ayuda a detectar problemas potenciales en tu código.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Si estás utilizando Web Vitals para medir el rendimiento de tu aplicación,
// puedes descomentar las siguientes líneas.
// import reportWebVitals from './reportWebVitals';
// reportWebVitals();
