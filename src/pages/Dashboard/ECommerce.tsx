import React from 'react';
import ChartOne from '../Testing/ChartOne';
import PieChart from '../Testing/PieChart';
// import  from '../Testing/IntensityChart';
import BarChart from '../Testing/IntensityChart';
const ECommerce: React.FC = () => {
  return (
    <div className="charts-container">
      <h1 className="text-bold text-5xl">Pie Chart </h1>
      <PieChart />
      <h1 className="text-bold text-5xl mb-5">Chart with all Paramenter</h1>

      <ChartOne />
      <h1 className="text-bold text-5xl mb-5">Chart based on Intensity 
        
      </h1>
      <BarChart />
    </div>
  );
};

export default ECommerce;
