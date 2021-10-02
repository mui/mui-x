import React from 'react';
import * as d3 from 'd3';
import color from '@mui/material/colors/blue';
import PieChart from '@mui/charts/PieChart';

const labels = ['Ford', 'Tesla'];

function generateData() {
  return [0, 1].map((i) => ({
    value: Math.abs(d3.randomNormal()()),
    fill: color[Object.keys(color)[i + 1]],
    label: labels[i],
  }));
}

export default function ExpaindingPieChart() {
  const data = generateData();

  return (
    <div style={{ width: '100%', height: 300 }}>
      <PieChart data={data} innerRadius={60} />
    </div>
  );
}
