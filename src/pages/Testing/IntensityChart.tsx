import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as d3 from 'd3';
import './BarChart.css';

const BarChart: React.FC = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/data'); // Replace with your API endpoint
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (data.length > 0) {
      createBarChart(data);
    }
  }, [data]);

  const createBarChart = (data: any[]) => {
    d3.select('#barChart').selectAll('*').remove();

    const intensityData = data.map((item) => ({
      intensity: item.intensity,
      topic: item.topic,
    }));

    const intensityCounts: { [key: number]: number } = {};

    intensityData.forEach((item) => {
      const intensity = item.intensity;
      intensityCounts[intensity] = (intensityCounts[intensity] || 0) + 1;
    });

    const intensityCountsArray = Object.entries(intensityCounts).map(([key, value]) => ({
      intensity: parseInt(key),
      count: value,
    }));

    const margin = { top: 20, right: 30, bottom: 40, left: 150 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select('#barChart')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([0, d3.max(intensityCountsArray, (d) => d.count)]).range([0, width]);

    const y = d3.scaleBand().domain(intensityCountsArray.map((d) => d.intensity.toString())).range([height, 0]).padding(0.1);

    svg.append('g').call(d3.axisLeft(y));

    svg
      .selectAll('.bar')
      .data(intensityCountsArray)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', 0)
      .attr('y', (d) => y(d.intensity.toString()))
      .attr('width', (d) => x(d.count))
      .attr('height', y.bandwidth())
      .attr('fill', '#69b3a2')
      .on('mouseover', function (event, d) {
        d3.select(this).attr('fill', '#4CAF50');
        d3.select('.tooltip')
          .style('display', 'block')
          .html(`Intensity: ${d.intensity}<br>Count: ${d.count}`)
          .style('left', `${event.pageX + 5}px`)
          .style('top', `${event.pageY - 28}px`);
      })
      .on('mouseout', function () {
        d3.select(this).attr('fill', '#69b3a2');
        d3.select('.tooltip').style('display', 'none');
      });
  };

  return (
    <div className="chart-card">
      <div id="barChart"></div>
      <div className="tooltip"></div>
    </div>
  );
};

export default BarChart;
