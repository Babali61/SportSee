import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { fetchUserPerformance } from '../services/api'; // Assurez-vous que le chemin est correct

const GraphiqueRadarPerformance = ({ userId }) => {
  const svgRef = useRef();
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const performanceResponse = await fetchUserPerformance(userId);
        console.log('Fetched Data:', performanceResponse);

        const performanceData = performanceResponse.data; // Accéder à l'objet imbriqué
        console.log('Performance Data:', performanceData);

        if (performanceData && Array.isArray(performanceData.data) && performanceData.kind) {
          console.log('Data array:', performanceData.data);
          console.log('Kind object:', performanceData.kind);

          const formattedData = performanceData.data.map(item => ({
            kind: performanceData.kind[item.kind],
            value: item.value
          }));
          
          console.log('Formatted Data:', formattedData);
          setData(formattedData);
        } else {
          console.error('Data format is incorrect:', performanceData);
          throw new Error('Data format is incorrect');
        }
      } catch (error) {
        console.error('Error fetching performance data:', error);
        setError(error.message);
      }
    };
    getData();
  }, [userId]);

  useEffect(() => {
    if (data.length === 0) return;

    const width = 100; // Ajuster la largeur
    const height = 100; // Ajuster la hauteur
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const radius = Math.min(width, height) / 2 - Math.max(margin.top, margin.right, margin.bottom, margin.left);

    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const angleSlice = (Math.PI * 2) / data.length;

    const radarLine = d3.line()
      .x((d, i) => radius * (d.value / 250) * Math.cos(angleSlice * i - Math.PI / 2))
      .y((d, i) => radius * (d.value / 250) * Math.sin(angleSlice * i - Math.PI / 2))
      .curve(d3.curveLinearClosed);

    // Draw the background polygons
    const levels = 5;
    for (let i = 0; i < levels; i++) {
      const levelData = data.map(d => ({
        value: ((i + 1) / levels) * 250,
        kind: d.kind
      }));

      svg.append('path')
        .datum(levelData)
        .attr('d', radarLine)
        .attr('fill', '#CDCDCD')
        .attr('stroke', '#CDCDCD')
        .attr('fill-opacity', 0.1);
    }

    // Draw the axes
    const axisGrid = svg.append('g').attr('class', 'axisWrapper');
    axisGrid.selectAll('.axis')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'axis')
      .each(function (d, i) {
        const g = d3.select(this);
        const x = radius * 1.1 * Math.cos(angleSlice * i - Math.PI / 2);
        const y = radius * 1.1 * Math.sin(angleSlice * i - Math.PI / 2);
        g.append('text')
          .attr('x', x)
          .attr('y', y)
          .attr('text-anchor', x > 0 ? 'start' : 'end')
          .attr('font-size', '4px') // Ajuster la taille du texte
          .attr('fill', '#ffffff')
          .text(d.kind);
      });

    // Draw the radar chart blobs
    svg.append('path')
      .datum(data)
      .attr('d', radarLine)
      .attr('fill', '#ff0101')
      .attr('fill-opacity', '0.7')
      .attr('stroke', '#ff0101')
      .attr('stroke-opacity', '0.1');

  }, [data]);

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  return (
    <div style={{ textAlign: 'center', backgroundColor: '#282D30', padding: '10px', borderRadius: '10px', width: '100%' }}>
      <svg ref={svgRef} style={{ width: '100%', height: 'auto' }}></svg>
    </div>
  );
};

export default GraphiqueRadarPerformance;
