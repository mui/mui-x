import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import { BarChart } from '@mui/x-charts/BarChart';

// Create sparse data where some bars would be very small
const sparseData: number[] = [0.02, 5, 0.05, 7, 0.01, 6, -0.03];
const categories: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function MinBarSize(): React.JSX.Element {
  const [minBarSize, setMinBarSize] = React.useState<number>(10);

  const handleChange = (event: Event, newValue: number | number[]) => {
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
        max={200}
        sx={{ width: 300 }}
      />
      <BarChart
        xAxis={[{ data: categories, scaleType: 'band' }]}
        series={[{ data: sparseData, minBarSize }]}
        height={300}
        width={400}
      />
    </Stack>
  );
}
