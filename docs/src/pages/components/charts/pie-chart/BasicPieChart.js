import React from 'react';
import * as d3 from 'd3';
import { pink } from '@mui/material/colors';
import PieChart from '@mui/charts/PieChart';

const labels = 'Ford Tesla GM VW BMW Audi'.split(' ');

function generateData() {
  const numSegments = d3.randomInt(3, 7)();

  return d3.range(numSegments).map((i) => ({
    value: d3.randomNormal(numSegments, 2)(),
    fill: pink[Object.keys(pink)[i]],
    stroke: 'white',
    label: labels[i],
  }));
}

export default function BasicPieChart() {
  const data = generateData();

  return (
    <div style={{ width: '100%', height: 300 }}>
      <PieChart
        data={data}
        margin={{ top: 50, bottom: 20 }}
        segmentLabelRadius={70}
        label="Car sales"
      />
    </div>
  );
}
