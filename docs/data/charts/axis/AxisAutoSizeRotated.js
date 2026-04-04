import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { LineChart } from '@mui/x-charts/LineChart';

export default function AxisAutoSizeRotated() {
  const [angle, setAngle] = React.useState(-45);

  return (
    <Box sx={{ width: '100%' }}>
      <Typography id="angle-slider" gutterBottom>
        Tick label angle: {angle}°
      </Typography>
      <Slider
        aria-labelledby="angle-slider"
        value={angle}
        onChange={(_, value) => setAngle(value)}
        min={-90}
        max={90}
        step={5}
        marks={[
          { value: -90, label: '-90°' },
          { value: -45, label: '-45°' },
          { value: 0, label: '0°' },
          { value: 45, label: '45°' },
          { value: 90, label: '90°' },
        ]}
        sx={{ mb: 2, maxWidth: 400 }}
      />
      <LineChart
        xAxis={[
          {
            scaleType: 'band',
            data: months,
            height: 'auto',
            tickLabelStyle: {
              angle,
            },
          },
        ]}
        yAxis={[
          {
            width: 'auto',
          },
        ]}
        series={[
          {
            data: temperatureData,
            label: 'Temperature (°C)',
            showMark: false,
          },
        ]}
        height={350}
      />
    </Box>
  );
}

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const temperatureData = [3, 5, 10, 15, 20, 25, 28, 27, 22, 15, 8, 4];
