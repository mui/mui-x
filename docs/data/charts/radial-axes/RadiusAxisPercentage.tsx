import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { RadialBarChart } from '@mui/x-charts-premium/RadialBarChart';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

const series = [
  { data: [3, 5, 7, 12, 15, 18], label: 'Series A', stack: 'a' },
  { data: [12, 15, 18, 16, 13, 6], label: 'Series B', stack: 'a' },
];

const sizes = [320, 200];

function Showcase({ minRadius }: { minRadius: number | string }) {
  return (
    <Stack direction="row" sx={{ gap: 2, alignItems: 'center', justifyContent: 'center' }}>
      {sizes.map((size) => (
        <RadialBarChart
          key={size}
          width={size}
          height={size}
          series={series}
          rotationAxis={[{ scaleType: 'band', data: months }]}
          radiusAxis={[{ scaleType: 'linear', minRadius, position: 'none' }]}
          grid={{ radius: true }}
          margin={{ left: 32, right: 32, top: 32, bottom: 32 }}
          hideLegend
        />
      ))}
    </Stack>
  );
}

export default function RadiusAxisPercentage() {
  return (
    <Stack sx={{ gap: 3, alignItems: 'center' }}>
      <div>
        <Typography align="center" gutterBottom>
          {'minRadius: 50 — fixed pixels, the hole stays the same size'}
        </Typography>
        <Showcase minRadius={50} />
      </div>
      <div>
        <Typography align="center" gutterBottom>
          {"minRadius: '40%' — scales with the chart"}
        </Typography>
        <Showcase minRadius="40%" />
      </div>
    </Stack>
  );
}
