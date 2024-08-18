import React from "react";
import logo from "../icons/logo.svg";

/**
 * Composant pour l'en-tête horizontal de l'application.
 * 
 * Affiche le logo de l'application et un menu de navigation horizontal.
 * 
 * @returns {JSX.Element} L'en-tête horizontal avec le logo et la navigation.
 */

const HeaderHorizontal = () => {
  return (
    <header className="header-horizontal">
      <div className="logo">
        <img src={logo} alt="SportSee Logo" />
      </div>
      <nav className="nav-horizontal">
        <ul>
          <li><a href="#accueil">Accueil</a></li>
          <li><a href="#profil">Profil</a></li>
          <li><a href="#reglage">Réglage</a></li>
          <li><a href="#communaute">Communauté</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default HeaderHorizontal;