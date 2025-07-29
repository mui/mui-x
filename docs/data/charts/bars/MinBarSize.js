import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import { BarChart } from '@mui/x-charts/BarChart';

// Create sparse data where some bars would be very small
const sparseData = [0.02, 5, null, 7, 0.01, 0, -0.03];

export default function MinBarSize() {
  const [minBarSize, setMinBarSize] = React.useState(10);

  const handleChange = (event, newValue) => {
    if (typeof newValue !== 'number') {
      return;
    }
    setMinBarSize(newValue);
  };

  return (
    <Stack spacing={2} justifyContent={'center'} alignItems={'center'}>
      <Typography id="min-bar-size-slider" gutterBottom>
        minBarSize: {minBarSize}px
      </Typography>
      <Slider
        value={minBarSize}
        onChange={handleChange}
        aria-labelledby="min-bar-size-slider"
        min={0}
        max={50}
        sx={{ width: 300 }}
      />
      <BarChart
        xAxis={[{ data: sparseData.map((v) => `${v}`), scaleType: 'band' }]}
        series={[{ data: sparseData, minBarSize }]}
        height={300}
        width={400}
      />
    </Stack>
  );
}
