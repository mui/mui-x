import * as React from 'react';
import { useXScale, useYScale, getValueToPositionMapper } from '@mui/x-charts/hooks';
import { LineChart } from '@mui/x-charts/LineChart';

const data = [
  { x: 1, y: 2 },
  { x: 2, y: 5 },
  { x: 3, y: 3 },
  { x: 4, y: 8 },
  { x: 5, y: 1 },
];

function CustomDataPoints() {
  const xScale = useXScale();
  const yScale = useYScale();

  // Use the value-to-position mapper to handle different scale types
  const xMapper = getValueToPositionMapper(xScale);
  const yMapper = getValueToPositionMapper(yScale);

  return (
    <g>
      {data.map((point, index) => {
        const x = xMapper(point.x);
        const y = yMapper(point.y);

        return (
          <g key={index}>
            {/* Custom data point */}
            <circle cx={x} cy={y} r={6} fill="red" stroke="white" strokeWidth={2} />
            {/* Value label */}
            <text
              x={x}
              y={y - 10}
              textAnchor="middle"
              fontSize="10"
              fill="red"
              fontWeight="bold"
            >
              ({point.x}, {point.y})
            </text>
          </g>
        );
      })}
    </g>
  );
}

export default function UseScale() {
  return (
    <LineChart
      dataset={data}
      xAxis={[
        {
          dataKey: 'x',
          label: 'X Values',
        },
      ]}
      yAxis={[
        {
          dataKey: 'y',
          label: 'Y Values',
        },
      ]}
      series={[
        {
          dataKey: 'y',
          label: 'Sample Data',
          color: '#8884d8',
        },
      ]}
    >
      <CustomDataPoints />
    </LineChart>
  );
}
