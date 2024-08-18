import React from "react";
import HeaderHorizontal from "./components/HeaderHorizontale";
import NavVertical from "./components/NavVerticale";
import MainContent from './components/MainContent';
import "./styles.css";

/**
 * Composant principal de l'application.
 * Affiche le header, la navigation verticale, et le contenu principal.
 *
 * @returns {JSX.Element} L'élément React de l'application.
 */

const App = () => {

  return (
    <div className="container">
      <HeaderHorizontal />
      <div className="main">
        <NavVertical />
        <MainContent />
      </div>
    </div>
  );
};

export default App;
