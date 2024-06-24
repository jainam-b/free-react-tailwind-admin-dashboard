import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as d3 from 'd3';
import './PieChart.css';

const PieChart: React.FC = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/data')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      createPieChart(data);
    }
  }, [data]);

  const createPieChart = (data) => {
    const topicCounts = data.reduce((acc, item) => {
      if (item.topic) {
        acc[item.topic] = (acc[item.topic] || 0) + 1;
      }
      return acc;
    }, {});

    const pieData = Object.entries(topicCounts).map(([key, value]) => ({
      topic: key,
      count: value,
    }));

    d3.select('#pieChart').selectAll('*').remove();

    const width = 450;
    const height = 450;
    const margin = 40;

    const radius = Math.min(width, height) / 2 - margin;

    const svg = d3.select('#pieChart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal()
      .domain(pieData.map(d => d.topic))
      .range(d3.schemeCategory10);

    const pie = d3.pie()
      .value(d => d.count);

    const data_ready = pie(pieData);

    svg.selectAll('path')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', d3.arc()
        .innerRadius(0)
        .outerRadius(radius))
      .attr('fill', d => color(d.data.topic))
      .attr('stroke', 'white')
      .style('stroke-width', '2px')
      .on('mouseover', function (event, d) {
        d3.select(this)
          .style('opacity', 0.7);
        d3.select('.tooltip')
          .style('display', 'block')
          .html(`Topic: ${d.data.topic}<br>Count: ${d.data.count}`)
          .style('left', `${event.pageX + 5}px`)
          .style('top', `${event.pageY - 28}px`);
      })
      .on('mouseout', function () {
        d3.select(this)
          .style('opacity', 1);
        d3.select('.tooltip')
          .style('display', 'none');
      });
  };

  return (
    <div className="chart-card">
      <div id="pieChart"></div>
      <div className="tooltip"></div>
    </div>
  );
};

export default PieChart;
