import * as React from 'react';
import Stack from '@mui/material/Stack';
import { BarChart } from '@mui/x-charts/BarChart';

const sparseData: (number | null)[] = [0.02, 5, null, 7, 0.01, 0, -0.03];

export default function MinBarSize(): React.JSX.Element {
  const minBarSize = 40;

  return (
    <Stack spacing={2} justifyContent="center" alignItems="center">
      <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
        <BarChart
          xAxis={[{ data: sparseData.map((v) => `${v}`), scaleType: 'band' }]}
          series={[{ data: sparseData, minBarSize }]}
          height={300}
          width={400}
          borderRadius={16}
        />
        <BarChart
          xAxis={[{ data: sparseData.map((v) => `${v}`), scaleType: 'band' }]}
          yAxis={[{ reverse: true }]}
          series={[{ data: sparseData, minBarSize }]}
          height={300}
          width={400}
          borderRadius={16}
        />
      </Stack>
      <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
        <BarChart
          yAxis={[{ data: sparseData.map((v) => `${v}`), scaleType: 'band' }]}
          series={[{ data: sparseData, minBarSize, layout: 'horizontal' }]}
          height={300}
          width={400}
          borderRadius={16}
        />
        <BarChart
          xAxis={[{ reverse: true }]}
          yAxis={[{ data: sparseData.map((v) => `${v}`), scaleType: 'band' }]}
          series={[{ data: sparseData, minBarSize, layout: 'horizontal' }]}
          height={300}
          width={400}
          borderRadius={16}
        />
      </Stack>
    </Stack>
  );
}
