import React from 'react';
import * as d3 from 'd3';
import PieChart from '@mui/charts/PieChart';

function generateData() {
  const numSegments = d3.randomUniform(3, 7)();
  return d3.range(numSegments).map((i) => ({
    value: Math.abs(d3.randomNormal()()),
    fill: d3.schemePaired[i],
    id: i,
    label: i,
  }));
}

export default function BasicPieChart() {
  const data = generateData();

  return <PieChart data={data} />;
}
