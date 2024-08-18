import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

/**
 * Composant graphique pour afficher le score d'un utilisateur sous forme de jauge.
 * 
 * Ce composant utilise D3.js pour créer une jauge représentant le score de l'utilisateur en pourcentage.
 * 
 * @param {Object} props - Les propriétés du composant.
 * @param {number} props.score - Le score de l'utilisateur à afficher.
 * @returns {JSX.Element} Une jauge représentant le score de l'utilisateur.
 */
const GaugeChart = ({ score }) => {
  /** Référence au conteneur SVG pour dessiner la jauge */
  const svgRef = useRef();

  /**
   * Effet secondaire pour créer et mettre à jour la jauge en fonction du score de l'utilisateur.
   * Ce hook s'exécute chaque fois que la valeur de `score` est modifiée.
   */
  useEffect(() => {
    /** Dimensions du SVG */
    const width = 100;
    const height = 100;

    /** Angle de départ de la jauge (ajusté en fonction du score) */
    const startAngle = score;

    /** Angle de fin de la jauge (correspondant à 180 degrés) */
    const endAngle = Math.PI;

    /** Rayon extérieur de la jauge */
    const outerRadius = Math.min(width, height) / 2.7;

    /** Rayon intérieur de la jauge (l'épaisseur de la jauge est de 5 unités) */
    const innerRadius = outerRadius - 5;

    /** Configuration du conteneur SVG */
    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    /** Fonction pour créer l'arc représentant la jauge */
    const arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .cornerRadius(10) // Ajout d'un rayon d'arrondi pour les coins de l'arc
      .startAngle(startAngle)
      .endAngle(d => startAngle + (endAngle - startAngle) * d.value);

    /** Ajout de l'arc de fond (en gris clair) */
    svg.append('path')
      .datum({ value: 1 }) // Remplissage complet du fond
      .attr('d', arc)
      .attr('fill', '#f8f8f8');

    /** Ajout de l'arc représentant le score de l'utilisateur (en rouge) */
    svg.append('path')
      .datum({ value: score / 100 }) // Remplissage partiel en fonction du score
      .attr('d', arc)
      .attr('fill', '#ff0000');

    /** Ajout d'un cercle au centre pour créer un effet de jauge */
    svg.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', innerRadius)
      .attr('fill', '#ffffff');

    /** Ajout du texte "Score" au-dessus de la jauge */
    svg.append('text')
      .attr('x', -32)
      .attr('y', -35)
      .attr('text-anchor', 'middle')
      .attr('font-weight', 'lightbold')
      .style('font-size', '6px')
      .style('fill', '#000')
      .text(`Score`);

    /** Affichage du pourcentage du score au centre de la jauge */
    svg.append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('text-anchor', 'middle')
      .style('font-size', '10px')
      .style('fill', '#000')
      .text(`${score}%`);

    /** Ajout de texte supplémentaire sous le score pour expliquer l'objectif */
    svg.append('text')
      .attr('x', 0)
      .attr('y', 9)
      .attr('text-anchor', 'middle')
      .style('font-size', '6px')
      .style('fill', '#666')
      .text('de votre');

    svg.append('text')
      .attr('x', 0)
      .attr('y', 17)
      .attr('text-anchor', 'middle')
      .style('font-size', '6px')
      .style('fill', '#666')
      .text('objectif');
  }, [score]);

  /** Rendu du composant avec le SVG contenant la jauge */
  return (
    <div className='piechart' style={{ textAlign: 'center', backgroundColor: '#f8f8f8', padding: '10px', borderRadius: '10px', width: '100%' }}>
      <svg ref={svgRef} style={{ width: '100%', height: 'auto' }}></svg>
    </div>
  );
};

export default GaugeChart;
