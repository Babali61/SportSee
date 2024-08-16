import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { fetchUserActivity } from "../services/api"; // Adjust the import if needed
import useResizeObserver from "../hooks/useResizeObserver"; // Assurez-vous que le chemin est correct

const GraphiqueActiviteQuotidienne = ({ userId }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  useEffect(() => {
    const getData = async () => {
      try {
        const activityResponse = await fetchUserActivity(userId);
        const activityData = activityResponse.data;

        if (activityData && Array.isArray(activityData.sessions)) {
          // Transformez les dates en jours numérotés de 1 à 7
          const transformedData = activityData.sessions.map(
            (session, index) => ({
              ...session,
              day: (index + 1).toString(),
            })
          );
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

  useEffect(() => {
    if (!dimensions) return;

    // Effacez le contenu précédent
    d3.select(svgRef.current).selectAll("*").remove();

    const margin = { top: 20, right: 50, bottom: 50, left: 50 };
    const width = dimensions.width - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)
      .append("g")
      .attr("transform", `translate(0,${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.day))
      .range([0, width + margin.right])
      .padding(0.8);

    // Trouver les valeurs min et max du poids
    const minWeight = Math.floor(d3.min(data, (d) => d.kilogram) / 5) * 5;
    const maxWeight = Math.ceil(d3.max(data, (d) => d.kilogram) / 5) * 5 + 2;

    const yRight = d3
      .scaleLinear()
      .domain([minWeight, maxWeight])
      .range([height, 30]);

    const yLeft = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.calories) * 2])
      .range([height, 0]);

    const xAxis = d3.axisBottom(x);
    const yAxisRight = d3
      .axisRight(yRight)
      .ticks((maxWeight - minWeight) / 5)
      .tickFormat(d3.format("d"));

    const roundedTopRect = (x, y, width, height, radius) => {
      return `M${x},${y + radius}
                a${radius},${radius} 0 0 1 ${radius},-${radius}
                h${width - 2 * radius}
                a${radius},${radius} 0 0 1 ${radius},${radius}
                v${height - radius}
                h-${width}
                Z`;
    };

    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height + 14})`)
      .call(xAxis)
      .call((g) => g.select(".domain").remove())
      .call((g) => g.selectAll(".tick line").remove())
      .call((g) => g.selectAll(".tick text").attr("dy", "10px"));

    svg
      .append("g")
      .attr("class", "y-axis-right")
      .attr("transform", `translate(${width + 45}, 0)`)
      .call(yAxisRight)
      .call((g) => g.select(".domain").remove())
      .call((g) => g.selectAll(".tick line").remove())
      .call((g) => g.selectAll(".tick text").attr("dx", "10px"));

    svg
      .append("text")
      .attr("x", 20)
      .attr("y", 15)
      .attr("fill", "#000")
      .attr("font-weight", "600")
      .attr("font-size", "14px")
      .text("Activité quotidienne");

    const calorietext = svg.append("g");
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

      

    // Ajouter des lignes de fond pour les poids
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

    svg
      .selectAll(".bar-calories")
      .data(data)
      .enter()
      .append("path")
      .attr("class", "bar-calories")
      .attr("d", (d) =>
        roundedTopRect(
          x(d.day)  + x.bandwidth() / 2,
          yLeft(d.calories),
          x.bandwidth() / 2.5,
          height - yLeft(d.calories),
          3
        )
      )
      .attr("fill", "#ff0000");

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

    // Ajouter Tooltip
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
      .on("mouseout", (d) => {
        tooltip.transition().duration(500).style("opacity", 0);
      });
  }, [data, dimensions]);

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  return (
    <div ref={wrapperRef} style={{ width: "100%", height: "250px" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default GraphiqueActiviteQuotidienne;
