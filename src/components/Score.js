import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const GaugeChart = ({ score }) => {
  const svgRef = useRef();

  useEffect(() => {
    const width = 100;
    const height = 100;
    const startAngle = score; // Adjust as necessary
    const endAngle = Math.PI;
    const outerRadius = Math.min(width, height) / 2.7;
    const innerRadius = outerRadius - 5;

    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .cornerRadius(10) // Add corner radius
      .startAngle(startAngle)
      .endAngle(d => startAngle + (endAngle - startAngle) * d.value);

    svg.append('path')
      .datum({ value: 1 })
      .attr('d', arc)
      .attr('fill', '#f8f8f8');

    svg.append('path')
      .datum({ value: score / 100 })
      .attr('d', arc)
      .attr('fill', '#ff0000');

    svg.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', innerRadius)
      .attr('fill', '#ffffff');

      svg.append('text')
      .attr('x', -32)
      .attr('y', -35)
      .attr('text-anchor', 'middle')
      .attr('font-weight', 'lightbold')
      .style('font-size', '6px')
      .style('fill', '#000')
      .text(`Score`);

    svg.append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('text-anchor', 'middle')
      .style('font-size', '10px')
      .style('fill', '#000')
      .text(`${score}%`);

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

  return (
    <div className='piechart' style={{ textAlign: 'center', backgroundColor: '#f8f8f8', padding: '10px', borderRadius: '10px', width: '100%' }}>
      <svg ref={svgRef} style={{ width: '100%', height: 'auto' }}></svg>
    </div>
  );
};

export default GaugeChart;
