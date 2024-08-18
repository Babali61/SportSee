import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { fetchUserActivity } from "../services/api"; // Ajustez l'import si nécessaire
import useResizeObserver from "../hooks/useResizeObserver"; // Assurez-vous que le chemin est correct

/**
 * Composant graphique pour afficher l'activité quotidienne d'un utilisateur.
 * 
 * Ce composant utilise D3.js pour créer un graphique à barres représentant les kilogrammes et les calories brûlées par jour.
 * 
 * @param {Object} props - Les propriétés du composant.
 * @param {number} props.userId - L'ID de l'utilisateur pour lequel afficher les données.
 * @returns {JSX.Element} Un graphique représentant l'activité quotidienne.
 */
const GraphiqueActiviteQuotidienne = ({ userId }) => {
  /** État pour stocker les données d'activité de l'utilisateur */
  const [data, setData] = useState([]);

  /** État pour gérer les erreurs éventuelles lors de la récupération des données */
  const [error, setError] = useState(null);

  /** Référence au conteneur SVG pour dessiner le graphique */
  const svgRef = useRef();

  /** Référence au conteneur du graphique pour observer les changements de taille */
  const wrapperRef = useRef();

  /** Dimensions actuelles du conteneur observées par le hook useResizeObserver */
  const dimensions = useResizeObserver(wrapperRef);

  /**
   * Effet secondaire pour récupérer les données d'activité de l'utilisateur à partir de l'API.
   * Ce hook s'exécute à chaque fois que l'ID de l'utilisateur change.
   */
  useEffect(() => {
    const getData = async () => {
      try {
        const activityResponse = await fetchUserActivity(userId);
        const activityData = activityResponse.data;

        if (activityData && Array.isArray(activityData.sessions)) {
          // Transformation des dates en jours numérotés de 1 à 7
          const transformedData = activityData.sessions.map((session, index) => ({
            ...session,
            day: (index + 1).toString(),
          }));
          setData(transformedData);
        } else {
          throw new Error("Data format is incorrect");
        }
      } catch (error) {
        setError(error.message);
      }
    };
    getData();
  }, [userId]);

  /**
   * Effet secondaire pour créer et mettre à jour le graphique à barres en fonction des données et des dimensions.
   * Ce hook s'exécute chaque fois que les données ou les dimensions du conteneur sont mises à jour.
   */
  useEffect(() => {
    if (!dimensions) return;

    // Effacer le contenu précédent
    d3.select(svgRef.current).selectAll("*").remove();

    /** Définition des marges, largeur et hauteur du graphique */
    const margin = { top: 20, right: 50, bottom: 50, left: 50 };
    const width = dimensions.width - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;

    /** Configuration du conteneur SVG */
    const svg = d3
      .select(svgRef.current)
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)
      .append("g")
      .attr("transform", `translate(0,${margin.top})`);

    /** Échelle pour l'axe des jours (abscisses) */
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.day))
      .range([0, width + margin.right])
      .padding(0.8);

    /** Calcul des valeurs min et max pour le poids */
    const minWeight = Math.floor(d3.min(data, (d) => d.kilogram) / 5) * 5;
    const maxWeight = Math.ceil(d3.max(data, (d) => d.kilogram) / 5) * 5 + 2;

    /** Échelle pour l'axe des poids (ordonnées à droite) */
    const yRight = d3
      .scaleLinear()
      .domain([minWeight, maxWeight])
      .range([height, 30]);

    /** Échelle pour l'axe des calories (ordonnées à gauche) */
    const yLeft = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.calories) * 2])
      .range([height, 0]);

    /** Création des axes */
    const xAxis = d3.axisBottom(x);
    const yAxisRight = d3
      .axisRight(yRight)
      .ticks((maxWeight - minWeight) / 5)
      .tickFormat(d3.format("d"));

    /** Fonction pour dessiner des rectangles arrondis */
    const roundedTopRect = (x, y, width, height, radius) => {
      return `M${x},${y + radius}
                a${radius},${radius} 0 0 1 ${radius},-${radius}
                h${width - 2 * radius}
                a${radius},${radius} 0 0 1 ${radius},${radius}
                v${height - radius}
                h-${width}
                Z`;
    };

    /** Ajout de l'axe des abscisses */
    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height + 14})`)
      .call(xAxis)
      .call((g) => g.select(".domain").remove())
      .call((g) => g.selectAll(".tick line").remove())
      .call((g) => g.selectAll(".tick text").attr("dy", "10px"));

    /** Ajout de l'axe des ordonnées à droite (poids) */
    svg
      .append("g")
      .attr("class", "y-axis-right")
      .attr("transform", `translate(${width + 45}, 0)`)
      .call(yAxisRight)
      .call((g) => g.select(".domain").remove())
      .call((g) => g.selectAll(".tick line").remove())
      .call((g) => g.selectAll(".tick text").attr("dx", "10px"));

    /** Ajout du titre du graphique */
    svg
      .append("text")
      .attr("x", 20)
      .attr("y", 15)
      .attr("fill", "#000")
      .attr("font-weight", "600")
      .attr("font-size", "14px")
      .text("Activité quotidienne");

    /** Ajout de la légende pour le poids (kg) */
    const kilotext = svg.append("g");
    kilotext
      .append("circle")
      .attr("cx", width * 0.68)
      .attr("cy", 10)
      .attr("r", 5)
      .attr("fill", "black");
    kilotext
      .append("text")
      .attr("x", width * 0.68 + 15)
      .attr("y", 15)
      .attr("fill", "#000")
      .attr("font-weight", "500")
      .attr("font-size", "11px")
      .text("Poids (kg)");

    /** Ajout de la légende pour les calories brûlées (kCal) */
    const calorietext = svg.append("g");
    calorietext
      .append("circle")
      .attr("cx", width * 0.87)
      .attr("cy", 10)
      .attr("r", 5)
      .attr("fill", "red");
    calorietext
      .append("text")
      .attr("x", width * 0.87 + 15)
      .attr("y", 15)
      .attr("fill", "#000")
      .attr("font-weight", "500")
      .attr("font-size", "11px")
      .text("Calories brûlées (kCal)");

    /** Ajout des lignes de fond pour les poids */
    for (let weight = minWeight; weight <= maxWeight; weight += 5) {
      svg
        .append("line")
        .attr("class", "weight-grid-line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", yRight(weight))
        .attr("y2", yRight(weight))
        .attr("stroke", "#e0e0e0")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", 4)
        .attr("transform", `translate(30, 0)`);
    }

    /** Dessin des barres représentant les calories brûlées */
    svg
      .selectAll(".bar-calories")
      .data(data)
      .enter()
      .append("path")
      .attr("class", "bar-calories")
      .attr("d", (d) =>
        roundedTopRect(
          x(d.day) + x.bandwidth() / 2,
          yLeft(d.calories),
          x.bandwidth() / 2.5,
          height - yLeft(d.calories),
          3
        )
      )
      .attr("fill", "#ff0000");

    /** Dessin des barres représentant le poids (kg) */
    svg
      .selectAll(".bar-kilogram")
      .data(data)
      .enter()
      .append("path")
      .attr("class", "bar-kilogram")
      .attr("d", (d) =>
        roundedTopRect(
          x(d.day),
          yRight(d.kilogram),
          x.bandwidth() / 2.5,
          height - yRight(d.kilogram),
          3
        )
      )
      .attr("fill", "#000000");

    /** Ajout du tooltip pour afficher les informations au survol */
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    svg
      .selectAll("rect")
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(`Poids: ${d.kilogram}kg<br>Calories: ${d.calories}Kcal`)
          .style("left", event.pageX + 5 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0);
      });
  }, [data, dimensions]);

  /** Affichage en cas d'erreur */
  if (error) {
    return <div>Erreur : {error}</div>;
  }

  /** Rendu du composant avec le SVG contenant le graphique à barres */
  return (
    <div ref={wrapperRef} style={{ width: "100%", height: "250px" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default GraphiqueActiviteQuotidienne;
