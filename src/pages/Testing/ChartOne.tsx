import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as d3 from 'd3';
// import './chartOne.css';

const ChartOne: React.FC = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    endYear: '',
    topic: '',
    sector: '',
    region: '',
    pest: '',
    source: '',
    swot: '',
    country: '',
    city: '',
  });

  useEffect(() => {
    axios.get('http://localhost:3000/data')
      .then((response) => {
        setData(response.data);
        setFilteredData(response.data);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const applyFilters = () => {
    let updatedData = data;

    if (filters.endYear) {
      updatedData = updatedData.filter(item => item.end_year === filters.endYear);
    }
    if (filters.topic) {
      updatedData = updatedData.filter(item => item.topic === filters.topic);
    }
    if (filters.sector) {
      updatedData = updatedData.filter(item => item.sector === filters.sector);
    }
    if (filters.region) {
      updatedData = updatedData.filter(item => item.region === filters.region);
    }
    if (filters.pest) {
      updatedData = updatedData.filter(item => item.pestle === filters.pest);
    }
    if (filters.source) {
      updatedData = updatedData.filter(item => item.source === filters.source);
    }
    if (filters.swot) {
      updatedData = updatedData.filter(item => item.swot === filters.swot);
    }
    if (filters.country) {
      updatedData = updatedData.filter(item => item.country === filters.country);
    }
    if (filters.city) {
      updatedData = updatedData.filter(item => item.city === filters.city);
    }

    setFilteredData(updatedData);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  useEffect(() => {
    if (filteredData.length > 0) {
      createChart(filteredData);
    }
  }, [filteredData]);

  const createChart = (data) => {
    d3.select('#chart').selectAll('*').remove();

    const svg = d3.select('#chart')
      .append('svg')
      .attr('width', '100%')
      .attr('height', 500);

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = svg.node().getBoundingClientRect().width - margin.left - margin.right;
    const height = svg.node().getBoundingClientRect().height - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(data.map(d => d.title))
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.intensity)]).nice()
      .range([height, 0]);

    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    g.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y));

    g.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.title))
      .attr('y', d => y(d.intensity))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.intensity))
      .attr('fill', '#3C50E0')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .attr('fill', '#80CAEE');
        d3.select('.tooltip')
          .style('display', 'block')
          .html(`Title: ${d.title}<br>Intensity: ${d.intensity}<br>Likelihood: ${d.likelihood}<br>Relevance: ${d.relevance}`)
          .style('left', `${event.pageX + 5}px`)
          .style('top', `${event.pageY - 28}px`);
      })
      .on('mouseout', function() {
        d3.select(this)
          .attr('fill', '#3C50E0');
        d3.select('.tooltip')
          .style('display', 'none');
      });
  };

  return (
    <div className="chart-container">
      <div className="filters">
        <label>
          End Year:
          <select name="endYear" value={filters.endYear} onChange={handleFilterChange}>
            <option value="">All</option>
            {Array.from(new Set(data.map(item => item.end_year))).map((year, idx) => (
              <option key={idx} value={year}>{year}</option>
            ))}
          </select>
        </label>
        <label>
          Topic:
          <select name="topic" value={filters.topic} onChange={handleFilterChange}>
            <option value="">All</option>
            {Array.from(new Set(data.map(item => item.topic))).map((topic, idx) => (
              <option key={idx} value={topic}>{topic}</option>
            ))}
          </select>
        </label>
        <label>
          Sector:
          <select name="sector" value={filters.sector} onChange={handleFilterChange}>
            <option value="">All</option>
            {Array.from(new Set(data.map(item => item.sector))).map((sector, idx) => (
              <option key={idx} value={sector}>{sector}</option>
            ))}
          </select>
        </label>
        <label>
          Region:
          <select name="region" value={filters.region} onChange={handleFilterChange}>
            <option value="">All</option>
            {Array.from(new Set(data.map(item => item.region))).map((region, idx) => (
              <option key={idx} value={region}>{region}</option>
            ))}
          </select>
        </label>
        <label>
          PEST:
          <select name="pest" value={filters.pest} onChange={handleFilterChange}>
            <option value="">All</option>
            {Array.from(new Set(data.map(item => item.pestle))).map((pest, idx) => (
              <option key={idx} value={pest}>{pest}</option>
            ))}
          </select>
        </label>
        <label>
          Source:
          <select name="source" value={filters.source} onChange={handleFilterChange}>
            <option value="">All</option>
            {Array.from(new Set(data.map(item => item.source))).map((source, idx) => (
              <option key={idx} value={source}>{source}</option>
            ))}
          </select>
        </label>
        <label>
          SWOT:
          <select name="swot" value={filters.swot} onChange={handleFilterChange}>
            <option value="">All</option>
            {Array.from(new Set(data.map(item => item.swot))).map((swot, idx) => (
              <option key={idx} value={swot}>{swot}</option>
            ))}
          </select>
        </label>
        <label>
          Country:
          <select name="country" value={filters.country} onChange={handleFilterChange}>
            <option value="">All</option>
            {Array.from(new Set(data.map(item => item.country))).map((country, idx) => (
              <option key={idx} value={country}>{country}</option>
            ))}
          </select>
        </label>
        <label>
          City:
          <select name="city" value={filters.city} onChange={handleFilterChange}>
            <option value="">All</option>
            {Array.from(new Set(data.map(item => item.city))).map((city, idx) => (
              <option key={idx} value={city}>{city}</option>
            ))}
          </select>
        </label>
      </div>
      <div id="chart"></div>
      <div className="tooltip"></div>
    </div>
  );
};

export default ChartOne;
