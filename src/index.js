import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/**
 * Point d'entrée principal de l'application React.
 * 
 * Monte le composant principal `App` dans l'élément DOM avec l'ID 'root'.
 */

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
