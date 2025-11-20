import * as React from 'react';
import Box from '@mui/material/Box';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';

import { tickFrequencies } from '@mui/x-charts/utils';
import alphabetStock from '../dataset/GOOGL.json';

export default function CustomTickFrequency() {
  return (
    <Box sx={{ width: '100%' }}>
      <BarChartPro
        {...barSettings}
        xAxis={[
          {
            ...xAxis,
            tickNumber: 15,
            timeOrdinalTicks: [
              'years',
              {
                ...tickFrequencies.quarters,
                format: (d) => `Q${Math.floor(d.getMonth() / 3) + 1}`,
              },
              {
                ...tickFrequencies.weeks,
                format: (d) => `W${getWeekNumber(d)}`,
              },
            ],
          },
        ]}
      />
    </Box>
  );
}

const zoom = { minSpan: 1, filterMode: 'discard' };

const xAxis = {
  id: 'date',
  data: alphabetStock.map((day) => new Date(day.date)),
  scaleType: 'band',
  zoom,
  valueFormatter: (value) => value.toLocaleDateString(),
  height: 30,
};

const barSettings = {
  height: 200,
  hideLegend: true,
  margin: { bottom: 5 },
  series: [
    {
      type: 'bar',
      yAxisId: 'volume',
      label: 'Volume',
      color: 'lightgray',
      data: alphabetStock.map((day) => day.volume),
    },
  ],
  yAxis: [
    {
      id: 'volume',
      scaleType: 'linear',
      position: 'left',
      valueFormatter: (value) => `${(value / 1000000).toLocaleString()}M`,
      width: 55,
    },
  ],
  grid: { vertical: true, horizontal: true },
};

function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}
