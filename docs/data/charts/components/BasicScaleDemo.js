import * as React from 'react';
import { ResponsiveChartContainer, LinePlot, useDrawingArea } from '@mui/x-charts';

function DrawingAreaBox() {
  const { left, top, width, height } = useDrawingArea();
  return (
    <React.Fragment>
      <path
        d={`M ${left} ${top} l ${width} 0 l 0 ${height} l -${width} 0 Z`}
        style={{ fill: 'none', stroke: 'black' }}
      />
      <circle cx={left} cy={top} r={3} style={{ fill: 'red' }} />
      <circle cx={left + width} cy={top + height} r={3} style={{ fill: 'red' }} />
      <text x={left} y={top} textAnchor="start" alignmentBaseline="text-after-edge">
        ({left},{top})
      </text>
      <text
        x={left + width}
        y={top + height}
        textAnchor="end"
        alignmentBaseline="text-before-edge"
      >
        ({left + width},{top + height})
      </text>
    </React.Fragment>
  );
}
export default function BasicScaleDemo() {
  return (
    <ResponsiveChartContainer
      margin={{ top: 20, left: 10, right: 10, bottom: 30 }}
      height={300}
      series={[
        {
          type: 'line',
          data: [13, 13, 54, 651, 657, 987, 64, 654, 954, 654, 897, 84],
        },
      ]}
      xAxis={[{ data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] }]}
    >
      <LinePlot />
      <DrawingAreaBox />
    </ResponsiveChartContainer>
  );
}
