import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import Typography from '@mui/material/Typography';
import { AxisConfig } from '@mui/x-charts/models';

const dataset = [
  { weekDay: 'Monday', value: 400 },
  { weekDay: 'Tuesday', value: 300 },
  { weekDay: 'Wednesday', value: 200 },
  { weekDay: 'Thursday', value: 500 },
  { weekDay: 'Friday', value: 400 },
  { weekDay: 'Saturday', value: 100 },
  { weekDay: 'Sunday', value: 50 },
];

const valueFormatter: AxisConfig['valueFormatter'] = (value, { location }) => {
  if (location === 'tick') {
    return value[0];
  }
  return value;
};

export default function BarChartDemo() {
  return (
    <React.Fragment>
      <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ px: 1 }}>
        Issues opened daily
      </Typography>
      <BarChart
        dataset={dataset}
        series={[{ dataKey: 'value' }]}
        margin={5}
        height={100}
        borderRadius={4}
        xAxis={[
          {
            dataKey: 'weekDay',
            scaleType: 'band',
            valueFormatter,
            disableTicks: true,
            tickLabelStyle: { fontWeight: 400 },
          },
        ]}
        yAxis={[{ position: 'none' }]}
      />
    </React.Fragment>
  );
}
