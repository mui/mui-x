import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';
import {
  BarSeriesType,
  LineSeriesType,
  XAxis,
  YAxis,
  ZoomOptions,
} from '@mui/x-charts-pro/models';
import { TimeTickKeys } from '@mui/x-charts/models';
import alphabetStock from '../dataset/GOOGL.json';

const tickFrequencies: TimeTickKeys[] = [
  'years',
  '3-months',
  'months',
  '2-weeks',
  'weeks',
  'days',
  'hours',
];

export default function OrdinalTickPlacement() {
  const [timeOrdinalTicks, setTimeOrdinalTicks] = React.useState<
    Record<TimeTickKeys, boolean>
  >({
    years: true,
    '3-months': true,
    months: true,
    '2-weeks': true,
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
            const checked = timeOrdinalTicks[label as keyof typeof timeOrdinalTicks];
            const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
              (frequency) =>
                timeOrdinalTicks[frequency as keyof typeof timeOrdinalTicks],
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
              (frequency) =>
                timeOrdinalTicks[frequency as keyof typeof timeOrdinalTicks],
            ),
          },
        ]}
      />
    </Box>
  );
}

const zoom: ZoomOptions = { minSpan: 1, filterMode: 'discard' };

const xAxis: XAxis = {
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
    } as BarSeriesType,
  ],
  yAxis: [
    {
      id: 'volume',
      scaleType: 'linear',
      position: 'left',
      valueFormatter: (value) => `${(value / 1000000).toLocaleString()}M`,
      width: 55,
    } as YAxis,
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
  ] as LineSeriesType[],
  yAxis: [
    { id: 'price', scaleType: 'linear', position: 'left', width: 50 } as YAxis,
  ],
};
