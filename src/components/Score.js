import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const GaugeChart = ({ score }) => {
  const svgRef = useRef();

  useEffect(() => {
    const width = 100; // Réduire la largeur
    const height = 100; // Réduire la hauteur
    const startAngle = score; // Commence à gauche
    const endAngle = Math.PI; // Termine à droite
    const outerRadius = Math.min(width, height) / 2;
    const innerRadius = outerRadius - 10; // Ajuster l'épaisseur du cercle

    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`) // Utilisation de viewBox pour rendre le SVG responsive
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(startAngle)
      .endAngle(d => startAngle + (endAngle - startAngle) * d.value);

    // Background arc (grey)
    svg.append('path')
      .datum({ value: 1 })
      .attr('d', arc)
      .attr('fill', '#f8f8f8');

    // Foreground arc (red)
    svg.append('path')
      .datum({ value: score / 100 })
      .attr('d', arc)
      .attr('fill', '#ff0000');

    // Center circle (white)
    svg.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', innerRadius)
      .attr('fill', '#ffffff');

    // Center text
    svg.append('text')
      .attr('x', 0)
      .attr('y', -3) // Ajuster la position du texte
      .attr('text-anchor', 'middle')
      .style('font-size', '10px') // Réduire la taille du texte
      .style('fill', '#000')
      .text(`${score}%`);

    svg.append('text')
      .attr('x', 0)
      .attr('y', 7) // Ajuster la position du texte
      .attr('text-anchor', 'middle')
      .style('font-size', '6px') // Réduire la taille du texte
      .style('fill', '#666')
      .text('de votre objectif');
  }, [score]);

  return (
    <div className='piechart' style={{ textAlign: 'center', backgroundColor: '#f8f8f8', padding: '10px', borderRadius: '10px', width: '100%'}}>
      <h3 style={{ position:'absolute',textAlign: 'left', marginLeft: '10px', fontSize: '12px' }}>Score</h3>
      <svg ref={svgRef} style={{ width: '100%', height: 'auto' }}></svg> {/* Rendre le SVG responsive */}
    </div>
  );
};

export default GaugeChart;
