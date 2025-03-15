import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import apiService from "../services/api";
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
        const activityData = await apiService.getUserActivity(userId);
        if (activityData && Array.isArray(activityData)) {
          // Transformation des dates en jours numérotés de 1 à 7
          const transformedData = activityData.map((session, index) => ({
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
    const maxWeight = Math.ceil(d3.max(data, (d) => d.kilogram) / 5) * 5;
    const lastGridLine = maxWeight - (maxWeight % 5);  // Dernière ligne de la grille

    /** Échelle pour l'axe des poids (ordonnées à droite) */
    const yRight = d3
      .scaleLinear()
      .domain([minWeight, maxWeight + 2])
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

    /** Fonction pour créer le path avec coins supérieurs arrondis */
    const roundedTopPath = (x, y, width, height, radius) => {
      return `
        M ${x},${y + radius}
        a ${radius},${radius} 0 0 1 ${radius},-${radius}
        h ${width - 2 * radius}
        a ${radius},${radius} 0 0 1 ${radius},${radius}
        v ${height - radius}
        h -${width}
        Z
      `;
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

    /** Animation en cascade des barres */
    // Barres de kilogrammes
    svg.selectAll(".bar-kilogram")
      .data(data)
      .enter()
      .append("path")
      .attr("class", "bar-kilogram")
      .attr("d", d => roundedTopPath(
        x(d.day),
        yRight(d.kilogram) + (height - yRight(d.kilogram)),
        x.bandwidth() / 2.5,
        0,
        3
      ))
      .attr("fill", "#000000")
      .transition()
      .duration(600)  // Durée plus courte pour chaque barre
      .delay((d, i) => i * 100)  // Délai croissant pour chaque barre
      .ease(d3.easeElastic)
      .attr("d", d => roundedTopPath(
        x(d.day),
        yRight(d.kilogram),
        x.bandwidth() / 2.5,
        height - yRight(d.kilogram),
        3
      ));

    // Barres de calories (avec un léger délai après les barres de kilogrammes)
    svg.selectAll(".bar-calories")
      .data(data)
      .enter()
      .append("path")
      .attr("class", "bar-calories")
      .attr("d", d => roundedTopPath(
        x(d.day) + x.bandwidth() / 2,
        yLeft(d.calories) + (height - yLeft(d.calories)),
        x.bandwidth() / 2.5,
        0,
        3
      ))
      .attr("fill", "#ff0000")
      .transition()
      .duration(600)
      .delay((d, i) => (i * 100))  // Commence après les barres de kilogrammes
      .ease(d3.easeElastic)
      .attr("d", d => roundedTopPath(
        x(d.day) + x.bandwidth() / 2,
        yLeft(d.calories),
        x.bandwidth() / 2.5,
        height - yLeft(d.calories),
        3
      ));

    // Création du tooltip
    const tooltip = svg
      .append("g")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // Rectangle rouge du tooltip
    tooltip
      .append("rect")
      .attr("fill", "#E60000")
      .attr("rx", 1)
      .attr("ry", 1)
      .attr("width", 50)
      .attr("height", 63);

    // Texte du tooltip
    const tooltipText = tooltip
      .append("g")
      .attr("fill", "white")
      .style("font-size", "11px")
      .style("font-weight", "500");

    tooltipText
      .append("text")
      .attr("class", "kg-text")
      .attr("text-anchor", "middle")
      .attr("x", 25)
      .attr("y", 20);

    tooltipText
      .append("text")
      .attr("class", "kcal-text")
      .attr("text-anchor", "middle")
      .attr("x", 25)
      .attr("y", 45);

    /** Ajout des zones de détection invisibles */
    svg.selectAll(".hover-area")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "hover-area")
      .attr("x", d => x(d.day) - x.bandwidth() * 0.25)
      .attr("y", 0)
      .attr("width", x.bandwidth() * 1.5)
      .attr("height", height)
      .attr("fill", "transparent")
      .attr("cursor", "pointer")
      .style("opacity", 0)  // Commence invisible
      .transition()
      .delay(data.length * 100 + 600)  // Attend que toutes les barres soient animées
      .duration(300)
      .style("opacity", 1)  // Devient détectable
      .on("end", function() {  // Ajoute les événements après l'animation
        d3.select(this)
          .on("mouseenter", function(event, d) {
            tooltip
              .style("opacity", 1)
              .attr("transform", `translate(${x(d.day) + x.bandwidth() + 15}, ${yRight(d.kilogram) - 75})`);
            
            tooltip.select(".kg-text").text(`${d.kilogram}kg`);
            tooltip.select(".kcal-text").text(`${d.calories}Kcal`);
            
            backgroundRect
              .style("display", "block")
              .attr("x", x(d.day) - x.bandwidth() * 0.25);
          })
          .on("mouseleave", function() {
            tooltip.style("opacity", 0);
            backgroundRect.style("display", "none");
          });
      });

    // Ajout du rectangle de fond gris
    const backgroundRect = svg
      .append("rect")
      .attr("class", "hover-background")
      .attr("width", x.bandwidth() * 1.5)
      .attr("y", yRight(lastGridLine))
      .attr("height", yRight(minWeight) - yRight(lastGridLine))
      .attr("fill", "#C4C4C4")
      .attr("opacity", 0.5)
      .style("display", "none");
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
