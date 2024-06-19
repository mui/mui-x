import * as React from 'react';
import Box from '@mui/material/Box';
import '@mui/x-charts-pro/typeOverloads';
import { UnstableHeatmap } from '@mui/x-charts-pro/Heatmap';

const data = [
  [0, 0, 1],
  [0, 1, 2],
  [0, 2, 4],
  [0, 3, 5],
  [0, 4, 2],
  [1, 0, 3],
  [1, 1, 5],
  [1, 2, 1],
  [1, 3, 2],
  [1, 4, 4],
  [2, 0, 5],
  [2, 1, 2],
  [2, 2, 3],
  [2, 3, 1],
  [2, 4, 2],
  [3, 0, 4],
  [3, 1, 5],
  [3, 2, 2],
  [3, 3, 3],
  [3, 4, 5],
];

function CustomCell(props) {
  const { x, y, width, height, ownerState, ...other } = props;

  return (
    <React.Fragment>
      <rect
        {...other}
        x={x + 4}
        y={y + 4}
        width={width - 2 * 4}
        height={height - 2 * 4}
        fill={ownerState.color}
        clipPath="inset(0px round 4px)"
      />
      <text
        x={x + width / 2}
        y={y + height / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        pointerEvents="none"
      >
        {ownerState.value}
      </text>
    </React.Fragment>
  );
}
export default function CustomItem() {
  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <UnstableHeatmap
        slots={{ cell: CustomCell }}
        xAxis={[{ data: [1, 2, 3, 4] }]}
        yAxis={[{ data: ['A', 'B', 'C', 'D', 'E'] }]}
        series={[{ data }]}
        margin={{ top: 5, right: 5, left: 20 }}
        height={300}
      />
    </Box>
  );
}
