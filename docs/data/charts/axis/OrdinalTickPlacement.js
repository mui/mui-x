import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';

import alphabetStock from '../dataset/GOOGL.json';

const tickFrequencies = [
  'years',
  'quarters',
  'months',
  'biweekly',
  'weeks',
  'days',
  'hours',
];

export default function OrdinalTickPlacement() {
  const [timeOrdinalTicks, setTimeOrdinalTicks] = React.useState({
    years: true,
    quarters: true,
    months: true,
    biweekly: true,
    weeks: true,
    days: true,
    hours: true,
  });

  return (
    <Box sx={{ width: '100%' }}>
      <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
        <FormLabel component="legend">Select tick frequencies</FormLabel>
        <FormGroup row>
          {tickFrequencies.map((label) => {
            const checked = timeOrdinalTicks[label];
            const handleChange = (event) => {
              setTimeOrdinalTicks((prev) => ({
                ...prev,
                [event.target.name]: event.target.checked,
              }));
            };

            return (
              <FormControlLabel
                key={label}
                control={
                  <Checkbox checked={checked} onChange={handleChange} name={label} />
                }
                label={label}
              />
            );
          })}
        </FormGroup>
      </FormControl>

      <BarChartPro
        {...barSettings}
        xAxis={[
          {
            ...xAxis,
            scaleType: 'band',
            zoom,
            timeOrdinalTicks: tickFrequencies.filter(
              (frequency) => timeOrdinalTicks[frequency],
            ),
          },
        ]}
      />
      <LineChartPro
        {...lineSettings}
        xAxis={[
          {
            ...xAxis,
            scaleType: 'point',
            zoom,
            timeOrdinalTicks: tickFrequencies.filter(
              (frequency) => timeOrdinalTicks[frequency],
            ),
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
  zoom: true,
  tickNumber: 5,
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
