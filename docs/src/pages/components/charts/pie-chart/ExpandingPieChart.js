import React from 'react';
import * as d3 from 'd3';
import color from '@mui/material/colors/deepPurple';
import PieChart from '@mui/charts/PieChart';

const labels = 'Ford Tesla GM VW BMW Audi'.split(' ');

function generateData() {
  const numSegments = d3.randomInt(3, 7)();
  console.log({ numSegments });
  return d3.range(numSegments).map((i) => ({
    value: d3.randomNormal(numSegments, 2)(),
    fill: color[Object.keys(color)[i]],
    label: labels[i],
  }));
}

export default function ExpaindingPieChart() {
  const data = generateData();

  return (
    <div style={{ width: '100%', height: 300 }}>
      <PieChart
        data={data}
        margin={{ top: 30, bottom: 30 }}
        expandOnHover
        segmentLabelRadius={140}
      />
    </div>
  );
}
