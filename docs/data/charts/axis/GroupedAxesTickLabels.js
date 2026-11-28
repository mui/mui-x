import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts/BarChart';

export default function GroupedAxesTickLabels() {
  const [width, setWidth] = React.useState(360);

  return (
    <Box sx={{ width: '100%' }}>
      <Typography id="grouped-axes-width-slider" gutterBottom>
        Chart width: {width}px
      </Typography>
      <Slider
        aria-labelledby="grouped-axes-width-slider"
        value={width}
        onChange={(_, value) => setWidth(value)}
        min={240}
        max={800}
        step={20}
        sx={{ mb: 2, maxWidth: 400 }}
      />
      <Box sx={{ width, maxWidth: '100%' }}>
        <BarChart
          height={260}
          xAxis={[
            {
              data,
              scaleType: 'band',
              tickSize: 8,
              height: 54,
              groups: [
                { getValue: getMonth },
                { getValue: getQuarter },
                { getValue: getYear },
              ],
              valueFormatter,
            },
          ]}
          series={[{ data: values, label: 'Orders' }]}
          margin={{ left: 0 }}
          hideLegend
        />
      </Box>
    </Box>
  );
}

const getMonth = (date) => date.toLocaleDateString('en-US', { month: 'short' });
const getQuarter = (date) => `Q${Math.floor(date.getMonth() / 3) + 1}`;
const getYear = (date) => date.toLocaleDateString('en-US', { year: 'numeric' });

const valueFormatter = (v) =>
  v.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

const data = Array.from({ length: 24 }, (_, index) => new Date(2024, index, 1));
const values = [
  32, 41, 38, 45, 52, 48, 55, 61, 58, 64, 70, 76, 68, 72, 79, 83, 88, 85, 91, 96, 93,
  99, 104, 110,
];
