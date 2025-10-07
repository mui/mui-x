import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';

import alphabetStock from '../dataset/GOOGL.json';

export default function OrdinalTickPlacement() {
  const [isNumerical, setIsNumerical] = React.useState(true);
  return (
    <Box sx={{ width: '100%' }}>
      <FormControlLabel
        checked={isNumerical}
        control={
          <Checkbox onChange={(event) => setIsNumerical(event.target.checked)} />
        }
        label="is numerical"
        labelPlacement="end"
      />
      <BarChartPro
        {...barSettings}
        xAxis={[{ ...xAxis, scaleType: 'band', zoom, tickNumber: 4, isNumerical }]}
      />
      <LineChartPro
        {...lineSettings}
        xAxis={[{ ...xAxis, scaleType: 'point', zoom, tickNumber: 4, isNumerical }]}
      />
    </Box>
  );
}

const zoom = { minSpan: 1, filterMode: 'discard' };

const xAxis = {
  id: 'date',
  data: alphabetStock.map((day) => new Date(day.date)),
  scaleType: 'band',
  zoom: true,
  tickNumber: 4,
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
};

const lineSettings = {
  height: 200,
  hideLegend: true,
  margin: { bottom: 5 },
  series: [
    {
      type: 'line',
      curve: 'linear',
      yAxisId: 'price',
      label: 'Open Price',
      data: alphabetStock.map((day) => day.open),
      showMark: false,
    },
  ],
  yAxis: [{ id: 'price', scaleType: 'linear', position: 'left', width: 50 }],
};
