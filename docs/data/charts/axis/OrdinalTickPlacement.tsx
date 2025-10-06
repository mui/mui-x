import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';
import { BarSeriesType, XAxis, YAxis } from '@mui/x-charts/models';
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
        height={400}
        series={series}
        xAxis={[
          { ...xAxis, scaleType: 'band', zoom: true, tickNumber: 4, isNumerical },
        ]}
        yAxis={[yAxis]}
      />
    </Box>
  );
}

const series = [
  {
    type: 'bar',
    yAxisId: 'volume',
    label: 'Volume',
    color: 'lightgray',
    data: alphabetStock.map((day) => day.volume),
  },
] as BarSeriesType[];

const xAxis: XAxis = {
  id: 'date',
  data: alphabetStock.map((day) => new Date(day.date)),
  scaleType: 'band',
  zoom: true,
  tickNumber: 4,
  valueFormatter: (value) => value.toLocaleDateString(),
  height: 40,
};

const yAxis: YAxis = {
  id: 'volume',
  scaleType: 'linear',
  position: 'left',
  valueFormatter: (value) => `${(value / 1000000).toLocaleString()}M`,
  width: 55,
};
