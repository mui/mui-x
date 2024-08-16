import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { LineChart } from '@mui/x-charts/LineChart';

import { HighlightedCode } from '@mui/docs/HighlightedCode';

const curveTypes = [
  'catmullRom',
  'linear',
  'monotoneX',
  'monotoneY',
  'natural',
  'step',
  'stepBefore',
  'stepAfter',
];

function getExample(curveType) {
  return `<LineChart
  series={[
    { curve: "${curveType}", data: [0, 5, 2, 6, 3, 9.3] },
    { curve: "${curveType}", data: [6, 3, 7, 9.5, 4, 2] },
  ]}
  {/* ... */}
/>`;
}
export default function InterpolationDemoNoSnap() {
  const [curveType, setCurveType] = React.useState('linear');

  return (
    <Box sx={{ p: 2, width: 1, maxWidth: 600 }}>
      <TextField
        select
        label="interpolation method"
        value={curveType}
        sx={{ minWidth: 200, mb: 2 }}
        onChange={(event) => setCurveType(event.target.value)}
      >
        {curveTypes.map((curve) => (
          <MenuItem key={curve} value={curve}>
            {curve}
          </MenuItem>
        ))}
      </TextField>
      <LineChart
        xAxis={[{ data: [1, 3, 5, 6, 7, 9], min: 0, max: 10 }]}
        series={[
          { curve: curveType, data: [0, 5, 2, 6, 3, 9.3] },
          { curve: curveType, data: [6, 3, 7, 9.5, 4, 2] },
        ]}
        height={300}
        margin={{ top: 10, bottom: 30 }}
        skipAnimation
      />
      <HighlightedCode code={getExample(curveType)} language="tsx" />
    </Box>
  );
}
