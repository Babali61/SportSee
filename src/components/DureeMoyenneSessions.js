import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { fetchUserAverageSessions } from "../services/api";

const DureeMoyenneSessions = ({ userId }) => {
  const svgRef = useRef();
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    if (data.length === 0) return;

    const dayInitials = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

    const dataWithInitials = data.map((d, i) => ({
      ...d,
      day: dayInitials[i % 7],
      uniqueDay: `${dayInitials[i % 7]}${i}`
    }));

    const margin = { top: 50, right: 20, bottom: 50, left: 20 };
    const width = 500 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .attr("width", "100%")
      .attr("height", "100%");

    svg.selectAll("*").remove();

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

    const g = svg.append("g")
      .attr("transform", `translate(0,${margin.top})`);

    const xDays = d3.scalePoint()
      .domain(dataWithInitials.map(d => d.uniqueDay))
      .range([0, width])
      .padding(0.5);

    const xLine = d3.scaleLinear()
      .domain([0, dataWithInitials.length - 1])
      .range([0, 500]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(dataWithInitials, d => d.sessionLength)])
      .nice()
      .range([300, 90]);

    const line = d3.line()
      .x((d, i) => xLine(i))
      .y(d => y(d.sessionLength))
      .curve(d3.curveCatmullRom.alpha(0.5));

    g.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "#ff0000");

    g.append("path")
      .datum(dataWithInitials)
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke", "url(#line-gradient)")
      .attr("stroke-width", 4)
      .attr("d", line);

    // TOOLTIP MINUTE
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

    // TOOLTIP RECTANGLE CURSOR
    const customCursor = g.append("rect")
      .attr("class", "custom-cursor")
      .attr("fill", "rgba(0, 0, 0, 0.1)")
      .attr("width", width) // Start with 0 width, it will be updated on mouseover
      .attr("height", height + margin.top + margin.bottom) // Ensure it covers the full height including margins
      .attr("y", -margin.top) // Position it correctly to cover from top to bottom
      .style("visibility", "hidden");

    // POINT SUR LIGNE
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

        // TOOLTIP RECTANGLE VISIBLE
        customCursor
          .attr("x", xPos)
          .attr("width", 555)
          .attr("height", 555) // Set the width to cover from the point to the end
          .style("visibility", "visible");
      })
      // TOOLTIP RECTANGLE
      .on("mouseout", function() {
        d3.select(this).attr("r", 5);
        tooltip.style("visibility", "hidden");
        customCursor.style("visibility", "hidden");
      });

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

    g.append("g")
      .attr("transform", `translate(${margin.left},${height})`)
      .attr("class", "custom-day-text")
      .call(d3.axisBottom(xDays).tickSize(0).tickPadding(10))
      .selectAll("text")
      .attr('font-weight', 'bold')
      .attr("fill", "rgba(225, 225, 225, 0.7)")
      .attr("font-size", "18px")
      .text((d, i) => dayInitials[i % 7]);

    g.selectAll(".domain").remove();

  }, [data]);

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  return (
    <div style={{ position: "relative", textAlign: "center", backgroundColor: "#ff0000", borderRadius: '10px', width: "100%"}}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default DureeMoyenneSessions;
