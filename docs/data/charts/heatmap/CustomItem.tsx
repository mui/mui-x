import * as React from 'react';
import Box from '@mui/material/Box';
import { Heatmap, type HeatmapCellProps } from '@mui/x-charts-pro/Heatmap';
import { data } from './dumbData';

function CustomCell(props: HeatmapCellProps) {
  // `xIndex` and `yIndex` are not valid DOM attributes, keep them out of `other`.
  const { x, y, width, height, xIndex, yIndex, ownerState, ...other } = props;

  // Cells on the diagonal are rendered as circles.
  const isDiagonal = xIndex === yIndex;

  return (
    <React.Fragment>
      <rect
        {...other}
        x={x + 4}
        y={y + 4}
        width={width - 2 * 4}
        height={height - 2 * 4}
        fill={ownerState.color}
        clipPath={
          // eslint-disable-next-line no-nested-ternary
          ownerState.isHighlighted
            ? undefined
            : isDiagonal
              ? 'circle(40%)'
              : 'inset(0px round 10px)'
        }
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
      <Heatmap
        slots={{ cell: CustomCell }}
        xAxis={[{ data: [1, 2, 3, 4] }]}
        yAxis={[{ data: ['A', 'B', 'C', 'D', 'E'] }]}
        series={[{ data, highlightScope: { highlight: 'item' } }]}
        height={300}
      />
    </Box>
  );
}
