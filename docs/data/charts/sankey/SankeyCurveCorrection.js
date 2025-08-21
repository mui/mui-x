import * as React from 'react';
import { Unstable_SankeyChart as SankeyChart } from '@mui/x-charts-pro/SankeyChart';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';

const data = {
  links: [
    { source: 'C', target: 'Y', value: 10 },
    { source: 'A', target: 'X', value: 25 },
    { source: 'B', target: 'X', value: 10 },
    { source: 'X', target: 'Z', value: 25 },
    { source: 'Y', target: 'Z', value: 8 },
    { source: 'B', target: 'Y', value: 5 },
  ],
};

export default function SankeyCurveCorrection() {
  const [curveCorrection, setCurveCorrection] = React.useState(5);

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Curve Correction: {curveCorrection}
      </Typography>
      <Slider
        value={curveCorrection}
        onChange={(_, value) => setCurveCorrection(value)}
        min={-20}
        max={20}
        step={1}
        sx={{ mb: 3 }}
        marks={[
          { value: -20, label: '-20' },
          { value: -10, label: '-10' },
          { value: 0, label: '0' },
          { value: 5, label: '5 (default)' },
          { value: 10, label: '10' },
          { value: 20, label: '20' },
        ]}
      />
      <SankeyChart
        height={400}
        series={{
          data,
          curveCorrection,
        }}
      />
    </Box>
  );
}
