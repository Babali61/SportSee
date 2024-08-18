import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../styles.css";
import { ReactComponent as FireIcon } from "../icons/fire.svg";
import { ReactComponent as ProteinIcon } from "../icons/protein.svg";
import { ReactComponent as CarbIcon } from "../icons/carb.svg";
import { ReactComponent as FatIcon } from "../icons/fat.svg";
import { fetchUserData } from "../services/api";

/**
 * Composant pour afficher les cartes de nutrition d'un utilisateur.
 * 
 * Ce composant affiche une série de cartes représentant les données nutritionnelles de l'utilisateur (calories, protéines, glucides, lipides).
 * 
 * @param {Object} props - Les propriétés du composant.
 * @param {number} props.id - L'ID de l'utilisateur pour lequel afficher les données nutritionnelles.
 * @returns {JSX.Element} Un ensemble de cartes de nutrition.
 */

const NutritionCard = ({ id }) => {
  console.log("NutritionCard received id:", id);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log(`Fetching data for user ID: ${id}`);
    const getUserData = async () => {
      try {
        const data = await fetchUserData(id);
        console.log("Fetched User Data:", data);
        setUserData(data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données utilisateur :",
          error
        );
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getUserData();
  }, [id]);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  console.log("UserData:", userData);

  if (!userData || !userData.data || !userData.data.keyData) {
    console.log("No keyData found");
    return <div>Aucune donnée disponible pour cet utilisateur.</div>;
  }

  const { keyData } = userData.data;

  return (
    <div className="nutrition-cards">
      <NutritionCardItem
        icon={<FireIcon />}
        value={`${keyData.calorieCount}kCal`}
        label="Calories"
        bgColor="#FFECEC"
      />
      <NutritionCardItem
        icon={<ProteinIcon />}
        value={`${keyData.proteinCount}g`}
        label="Protéines"
        bgColor="#ECF4FF"
      />
      <NutritionCardItem
        icon={<CarbIcon />}
        value={`${keyData.carbohydrateCount}g`}
        label="Glucides"
        bgColor="#FFF9EC"
      />
      <NutritionCardItem
        icon={<FatIcon />}
        value={`${keyData.lipidCount}g`}
        label="Lipides"
        bgColor="#FFECF1"
      />
    </div>
  );
};

const NutritionCardItem = ({ icon, value, label, bgColor }) => {
  return (
    <div className="nutrition-card">
      <div className="icon" style={{backgroundColor: bgColor, borderRadius : "8px"}}>{icon}</div>
      <div className="wrapValueAndText">
        <div className="value">{value}</div>
        <div className="label">{label}</div>
      </div>
    </div>
  );
};

NutritionCardItem.propTypes = {
  icon: PropTypes.element.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  bgColor: PropTypes.string.isRequired,
};

NutritionCard.propTypes = {
  id: PropTypes.number.isRequired,
};

export default NutritionCard;
