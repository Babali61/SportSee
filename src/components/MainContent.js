import React from "react";
import GraphiqueActiviteQuotidienne from "./GraphiqueActiviteQuotidienne";
import DureeMoyenneSessions from "./DureeMoyenneSessions";
import GraphiqueRadarPerformance from "./GraphiqueRadarPerformance";
import Score from "./Score";

const MainContent = () => {
  const userId = 12; // Exemple d'ID utilisateur

  return (
    <div className="content">
      <h1>Bonjour Thomas</h1>
      <p>Félicitation ! Vous avez explosé vos objectifs hier 🎉</p>
      {/* <GraphiqueActiviteQuotidienne userId={userId} /> */}
      <div className="content-graph-three">
        <div className="content-graph">
          <DureeMoyenneSessions userId={userId} />
        </div>
        <div className="content-graph">
          <GraphiqueRadarPerformance userId={userId} />
        </div>
        <div className="content-graph">
          <Score score={12} />
        </div>
      </div>
    </div>
  );
};

export default MainContent;
