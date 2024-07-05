import React from "react";

import HeaderHorizontal from "./components/HeaderHorizontale";
import NavVertical from "./components/NavVerticale";
import MainContent from './components/MainContent';
import "./styles.css";

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
