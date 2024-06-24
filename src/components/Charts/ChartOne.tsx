import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as d3 from 'd3';

const ChartOne: React.FC = () => {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/data');
      const apiData = response.data;

      // Filter data based on intensity greater than or equal to 3
      const filteredData = apiData.filter((item: any) => item.intensity >= 3);

      // Transform filtered data for D3 chart
      const transformedData = filteredData.map((item: any) => ({
        name: item.title,
        data: [item.intensity, item.relevance, item.likelihood], // Adjust based on your API data structure
      }));

      setChartData(transformedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (chartData.length > 0) {
      drawChart();
    }
  }, [chartData]);

  const drawChart = () => {
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select('#chartOne')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(chartData.map((d) => d.name))
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear().domain([0, 100]).range([height, 0]);

    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append('g').call(d3.axisLeft(y));

    const line = d3
      .line()
      .x((d: any) => x(d.name) || 0)
      .y((d: any) => y(d.data[0]) || 0);

    svg
      .append('path')
      .datum(chartData)
      .attr('fill', 'none')
      .attr('stroke', '#3C50E0')
      .attr('stroke-width', 2)
      .attr('d', line);

    const area = d3
      .area()
      .x((d: any) => x(d.name) || 0)
      .y0(height)
      .y1((d: any) => y(d.data[1]) || 0);

    svg
      .append('path')
      .datum(chartData)
      .attr('fill', '#80CAEE')
      .attr('d', area);
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-primary">Total Revenue</p>
              <p className="text-sm font-medium">12.04.2022 - 12.05.2022</p>
            </div>
          </div>
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-secondary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-secondary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-secondary">Total Sales</p>
              <p className="text-sm font-medium">12.04.2022 - 12.05.2022</p>
            </div>
          </div>
        </div>
        <div className="flex w-full max-w-45 justify-end">
          <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
            <button className="rounded bg-white py-1 px-3 text-xs font-medium text-black shadow-card hover:bg-white hover:shadow-card dark:bg-boxdark dark:text-white dark:hover:bg-boxdark">
              Day
            </button>
            <button className="rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark">
              Week
            </button>
            <button className="rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark">
              Month
            </button>
          </div>
        </div>
      </div>

      <div id="chartOne"></div>
    </div>
  );
};

export default ChartOne;
