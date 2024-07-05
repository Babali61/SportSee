import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { fetchUserAverageSessions } from "../services/api";

const DureeMoyenneSessions = ({ userId }) => {
  const svgRef = useRef();
  const overlayRef = useRef(); // Reference for the overlay div
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const sessionsResponse = await fetchUserAverageSessions(userId);
        console.log("Fetched Average Sessions Data:", sessionsResponse);

        const sessionsData = sessionsResponse.data; // Accéder à l'objet imbriqué
        console.log("Average Sessions Data:", sessionsData);

        if (sessionsData && Array.isArray(sessionsData.sessions)) {
          console.log("Sessions array:", sessionsData.sessions);
          setData(sessionsData.sessions);
        } else {
          console.error("Data format is incorrect:", sessionsData);
          throw new Error("Data format is incorrect");
        }
      } catch (error) {
        console.error("Error fetching average sessions data:", error);
        setError(error.message);
      }
    };
    getData();
  }, [userId]);

  useEffect(() => {
    if (data.length === 0) return;

    // Map the days to their initials, allowing duplicates
    const dayInitials = {
      1: 'L',
      2: 'M',
      3: 'M',
      4: 'J',
      5: 'V',
      6: 'S',
      7: 'D'
    };

    const dataWithInitials = data.map(d => ({
      ...d,
      day: dayInitials[d.day] || d.day
    }));

    const margin = { top: 50, right: 20, bottom: 50, left: 20 };
    const width = 500 - 0 - 0;
    const height = 500 - 0 - 0;

    const svg = d3.select(svgRef.current)
      .attr("viewBox", `0 0 ${width +25} ${height + 22}`)
      .attr("width", "100%")
      .attr("height", "100%");

    svg.selectAll("*").remove(); // Clear previous content

    const g = svg.append("g")
      .attr("transform", `translate(10,50)`);

    const x = d3.scalePoint()
      .domain(dataWithInitials.map((d, i) => d.day + i)) // Add index to differentiate days with the same initial
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(dataWithInitials, d => d.sessionLength)])
      .nice()
      .range([300, 33,33]);

    const line = d3.line()
      .x((d, i) => x(d.day + i)) // Use combined day and index for x position
      .y(d => y(d.sessionLength))
      .curve(d3.curveCatmullRom.alpha(0.5)); // Courbe plus lisse

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
      .attr("stroke-width", 3)
      .attr("d", line);

    const tooltip = g.append("g")
      .attr("class", "tooltip")
      .style("visibility", "hidden");

    tooltip.append("rect")
      .attr("x", -25)
      .attr("y", -35)
      .attr("width", 50)
      .attr("height", 25)
      .attr("fill", "white")
      .attr("stroke", "#ddd")
      .attr("rx", 5)
      .attr("ry", 5);

    tooltip.append("text")
      .attr("x", 0)
      .attr("y", -20)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "#333");

      const customCursor = g.append("rect")
      .attr("class", "custom-cursor")
      .attr("fill", "rgba(0, 0, 0, 0.3)")
      .style("visibility", "hidden");

    g.selectAll(".dot")
      .data(dataWithInitials)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", (d, i) => x(d.day + i)) // Use combined day and index for x position
      .attr("cy", d => y(d.sessionLength))
      .attr("r", 5)
      .attr("fill", "white")
      .on("mouseover", function(event, d) {
        d3.select(this).attr("r", 7);
        tooltip.style("visibility", "visible")
          .attr("transform", `translate(${x(d.day + dataWithInitials.indexOf(d))},${y(d.sessionLength)})`);
        tooltip.select("text").text(`${d.sessionLength} min`);

        // Adjust the overlay to cover the whole parent div starting from the hovered point
        d3.select(overlayRef.current)
          .style("visibility", "visible")
          .style("left", `${x(d.day + dataWithInitials.indexOf(d)) + margin.left}px`)
          .style("width", `calc(100% - ${x(d.day + dataWithInitials.indexOf(d)) + margin.left}px)`);
          customCursor
          .attr("x", x(d.day + dataWithInitials.indexOf(d)))
          .attr("y", 0)
          .attr("width", width - x(d.day + dataWithInitials.indexOf(d)))
          .style("visibility", "visible");
      })
      .on("mouseout", function() {
        d3.select(this).attr("r", 5);
        tooltip.style("visibility", "hidden");
        d3.select(overlayRef.current).style("visibility", "hidden");
      });

    g.append("text")
      .attr("x", 10)
      .attr("y", -10)
      .attr('position','absolute')
      .attr("fill", "white")
      .attr("font-size", "18px")
      .text("Durée moyenne des sessions");

    g.append("g")
      .attr("transform", `translate(0,371)`)
      .call(d3.axisBottom(x).tickSize(0).tickPadding(10).tickFormat((d, i) => dataWithInitials[i].day))
      .selectAll("text")
      .attr("fill", "white")
      .attr("font-size", "18px");

    // Retirer la ligne noire de l'axe X
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
