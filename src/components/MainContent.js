import React, { useState, useEffect } from "react";
import GraphiqueActiviteQuotidienne from "./GraphiqueActiviteQuotidienne";
import DureeMoyenneSessions from "./DureeMoyenneSessions";
import GraphiqueRadarPerformance from "./GraphiqueRadarPerformance";
import NutritionCard from "./NutritionCard";
import Score from "./Score";
import apiService from "../services/api";

/**
 * Composant du corps de page principal.
 * Contient les graphiques d'activité, les sessions moyennes, la performance radar, le score de l'utilisateur, et les cartes de nutrition.
 *
 * @returns {JSX.Element} Le contenu principal de l'application avec les graphiques et les cartes nutritionnelles.
 */

const MainContent = () => {
  const userId = 18;
  const [userName, setUserName] = useState("");
  const [userScore, setUserScore] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    // On utilise la méthode du service qui gère l'appel API
    apiService.getUserFirstName(userId)
      .then(firstName => setUserName(firstName))
      .catch(error => {
        console.error("Erreur lors de la récupération du nom d'utilisateur:", error);
        setError(error.message);
      });
  
  apiService.getUserScore(userId)
      .then(score => setUserScore(score))
      .catch(error => {
        console.error("Erreur lors de la récupération du score:", error);
        setError(error.message);
      });
  }, [userId]);

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  return (
    <div className="content">
      <div>
        <h1>Bonjour {userName}</h1>
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
                <Score score={userScore} />
              </div>
            </div>
          </div>
          <div className="nutrition-content">
            <NutritionCard id={userId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
