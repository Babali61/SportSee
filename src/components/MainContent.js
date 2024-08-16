import React from "react";
import GraphiqueActiviteQuotidienne from "./GraphiqueActiviteQuotidienne";
import DureeMoyenneSessions from "./DureeMoyenneSessions";
import GraphiqueRadarPerformance from "./GraphiqueRadarPerformance";
import NutritionCard from "./NutritionCard";
import Score from "./Score";

const MainContent = () => {
  const userId = 12;
  const id = 12; // Exemple d'ID utilisateur

  return (
    <div className="content">
      <div>
        <h1>Bonjour Thomas</h1>
        <p>Félicitation ! Vous avez explosé vos objectifs hier 🎉</p>
        <div className="graphsAndNutrition">
          <div className="graphs">
            <div className="content-graph-activity">
              <GraphiqueActiviteQuotidienne userId={userId} />
            </div>
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
          <div className="nutrition-content">
            <NutritionCard id={id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
