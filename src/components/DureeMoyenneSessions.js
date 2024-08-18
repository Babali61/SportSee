import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { fetchUserAverageSessions } from "../services/api";

/**
 * Composant graphique pour afficher la durée moyenne des sessions d'un utilisateur.
 * 
 * Ce composant utilise D3.js pour créer un graphique linéaire représentant la durée moyenne des sessions par jour.
 * 
 * @param {Object} props - Les propriétés du composant.
 * @param {number} props.userId - L'ID de l'utilisateur pour lequel afficher les données.
 * @returns {JSX.Element} Un graphique représentant la durée moyenne des sessions.
 */
const DureeMoyenneSessions = ({ userId }) => {
  /** Référence au conteneur SVG pour dessiner le graphique */
  const svgRef = useRef();

  /** État pour stocker les données des sessions de l'utilisateur */
  const [data, setData] = useState([]);

  /** État pour gérer les erreurs éventuelles lors de la récupération des données */
  const [error, setError] = useState(null);

  /**
   * Effet secondaire pour récupérer les données des sessions de l'utilisateur à partir de l'API.
   * Ce hook s'exécute à chaque fois que l'ID de l'utilisateur change.
   */
  useEffect(() => {
    const getData = async () => {
      try {
        const sessionsResponse = await fetchUserAverageSessions(userId);
        const sessionsData = sessionsResponse.data;

        if (sessionsData && Array.isArray(sessionsData.sessions)) {
          setData(sessionsData.sessions);
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
   * Effet secondaire pour créer et mettre à jour le graphique avec les nouvelles données.
   * Ce hook s'exécute chaque fois que les données des sessions sont mises à jour.
   */
  useEffect(() => {
    if (data.length === 0) return;

    /** Initiales des jours de la semaine */
    const dayInitials = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

    /** Données avec les initiales des jours pour l'axe des abscisses */
    const dataWithInitials = data.map((d, i) => ({
      ...d,
      day: dayInitials[i % 7],
      uniqueDay: `${dayInitials[i % 7]}${i}`
    }));

    /** Marges pour le graphique */
    const margin = { top: 50, right: 20, bottom: 50, left: 20 };
    const width = 500 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    /** Configuration du SVG */
    const svg = d3.select(svgRef.current)
      .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .attr("width", "100%")
      .attr("height", "100%");

    /** Suppression de tout élément existant dans le SVG */
    svg.selectAll("*").remove();

    /** Création du dégradé pour la ligne du graphique */
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "line-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");
    
    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "rgba(225, 225, 225, 0.7)");
    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "rgb(225, 225, 225)");

    /** Groupe principal pour contenir tous les éléments du graphique */
    const g = svg.append("g")
      .attr("transform", `translate(0,${margin.top})`);

    /** Échelle pour positionner les jours sur l'axe des abscisses */
    const xDays = d3.scalePoint()
      .domain(dataWithInitials.map(d => d.uniqueDay))
      .range([0, width])
      .padding(0.5);

    /** Échelle linéaire pour positionner les points sur la ligne du graphique */
    const xLine = d3.scaleLinear()
      .domain([0, dataWithInitials.length - 1])
      .range([0, 500]);

    /** Échelle linéaire pour l'axe des ordonnées (durée des sessions) */
    const y = d3.scaleLinear()
      .domain([0, d3.max(dataWithInitials, d => d.sessionLength)])
      .nice()
      .range([300, 90]);

    /** Fonction pour dessiner la ligne du graphique */
    const line = d3.line()
      .x((d, i) => xLine(i))
      .y(d => y(d.sessionLength))
      .curve(d3.curveCatmullRom.alpha(0.5));

    /** Rectangle de fond du graphique */
    g.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "#ff0000");

    /** Dessin de la ligne représentant la durée moyenne des sessions */
    g.append("path")
      .datum(dataWithInitials)
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke", "url(#line-gradient)")
      .attr("stroke-width", 4)
      .attr("d", line);

    /** Création d'un tooltip pour afficher la durée des sessions au survol des points */
    const tooltip = svg.append("g")
      .attr("class", "tooltip")
      .style("visibility", "hidden");

    tooltip.append("rect")
      .attr("x", 15)
      .attr("y", 5)
      .attr("width", 50)
      .attr("height", 35)
      .attr("fill", "white")
      .attr("stroke", "#ddd");

    tooltip.append("text")
      .attr("x", 40)
      .attr("y", 25)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr('font-weight', 'bold')
      .attr("fill", "#333");

    /** Rectangle personnalisable pour le curseur */
    const customCursor = g.append("rect")
      .attr("class", "custom-cursor")
      .attr("fill", "rgba(0, 0, 0, 0.1)")
      .attr("width", width) // Initialisation avec la largeur du graphique
      .attr("height", height + margin.top + margin.bottom)
      .attr("y", -margin.top)
      .style("visibility", "hidden");

    /** Ajout des points sur la ligne du graphique */
    g.selectAll(".dot")
      .data(dataWithInitials)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", (d, i) => xLine(i))
      .attr("cy", d => y(d.sessionLength))
      .attr("stroke", "url(#line-gradient)")
      .attr("r", 5)
      .attr("fill", "white")
      .on("mouseover", function(event, d) {
        const xPos = xLine(dataWithInitials.indexOf(d));
        d3.select(this).attr("r", 7);
        tooltip.style("visibility", "visible")
          .attr("transform", `translate(${xPos},${y(d.sessionLength)})`);
        tooltip.select("text").text(`${d.sessionLength} min`);

        /** Affichage du curseur personnalisé */
        customCursor
          .attr("x", xPos)
          .attr("width", 555)
          .attr("height", 555)
          .style("visibility", "visible");
      })
      .on("mouseout", function() {
        d3.select(this).attr("r", 5);
        tooltip.style("visibility", "hidden");
        customCursor.style("visibility", "hidden");
      });

    /** Ajout du texte du titre du graphique */
    g.append("text")
      .attr("x", 60)
      .attr("y", 15)
      .attr("fill", "rgba(225, 225, 225, 0.7)")
      .attr("font-size", "30px")
      .text("Durée moyenne des");

    g.append("text")
      .attr("x", 60)
      .attr("y", 45)
      .attr("fill", "rgba(225, 225, 225, 0.7)")
      .attr("font-size", "30px")
      .text("sessions");

    /** Ajout de l'axe des jours sous le graphique */
    g.append("g")
      .attr("transform", `translate(${margin.left},${height})`)
      .attr("class", "custom-day-text")
      .call(d3.axisBottom(xDays).tickSize(0).tickPadding(10))
      .selectAll("text")
      .attr('font-weight', 'bold')
      .attr("fill", "rgba(225, 225, 225, 0.7)")
      .attr("font-size", "18px")
      .text((d, i) => dayInitials[i % 7]);

    /** Suppression de la ligne de l'axe des abscisses */
    g.selectAll(".domain").remove();

  }, [data]);

  /** Gestion de l'affichage en cas d'erreur */
  if (error) {
    return <div>Erreur : {error}</div>;
  }

  /** Rendu du composant avec le SVG contenant le graphique */
  return (
    <div style={{ position: "relative", textAlign: "center", backgroundColor: "#ff0000", borderRadius: '10px', width: "100%"}}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default DureeMoyenneSessions;
