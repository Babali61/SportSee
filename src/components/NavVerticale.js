import React from 'react';
import yogaIcon from '../icons/yoga-icon.svg'; // Remplacez par le chemin de vos icônes
import swimIcon from '../icons/swim-icon.svg';
import bikeIcon from '../icons/bike-icon.svg';
import strengthIcon from '../icons/strength-icon.svg';

/**
 * Composant pour la navigation verticale de l'application.
 * 
 * Affiche une liste d'icônes de navigation verticale et un message de copyright.
 * 
 * @returns {JSX.Element} La navigation verticale avec les icônes et le copyright.
 */

const NavVerticale = () => {
  return (
    <nav className="nav-vertical">
      <ul className="nav-icons">
        <li><img src={yogaIcon} alt="Yoga" /></li>
        <li><img src={swimIcon} alt="Natation" /></li>
        <li><img src={bikeIcon} alt="Cyclisme" /></li>
        <li><img src={strengthIcon} alt="Musculation" /></li>
      </ul>
      <div className="copyright">
        <p>Copyright, SportSee 2020</p>
      </div>
    </nav>
  );
};

export default NavVerticale;