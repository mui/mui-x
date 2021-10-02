import React from 'react';
import * as d3 from 'd3';
import { deepPurple } from '@mui/material/colors';
import PieChart from '@mui/charts/PieChart';

const labels = 'Ford Tesla GM VW BMW Audi'.split(' ');

function generateData() {
  const numSegments = d3.randomInt(3, 7)();

  return d3.range(numSegments).map((i) => ({
    value: d3.randomNormal(numSegments, 2)(),
    fill: deepPurple[Object.keys(deepPurple)[i]],
    stroke: 'white',
    label: labels[i],
  }));
}

export default function ExpaindingPieChart() {
  const data = generateData();

  return (
    <div style={{ width: '100%', height: 400 }}>
      <PieChart
        data={data}
        expandOnHover
        label="Car sales"
        margin={{ top: 70, bottom: 20 }}
        segmentLabelRadius={170}
        sort="ascending"
      />
    </div>
  );
}
