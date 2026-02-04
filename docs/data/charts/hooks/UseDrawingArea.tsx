import { useDrawingArea } from '@mui/x-charts/hooks';
import { LineChart } from '@mui/x-charts/LineChart';

function CustomOverlay() {
  const { left, top, width, height } = useDrawingArea();

  return (
    <g>
      {/* Drawing area border */}
      <rect
        x={left}
        y={top}
        width={width}
        height={height}
        fill="transparent"
        stroke="red"
        strokeWidth={2}
        strokeDasharray="5,5"
      />

      {/* Corner markers */}
      <circle cx={left} cy={top} r={4} fill="red" />
      <circle cx={width + left} cy={top} r={4} fill="red" />
      <circle cx={width + left} cy={top + height} r={4} fill="red" />
      <circle cx={left} cy={top + height} r={4} fill="red" />

      {/* Center cross */}
      <g stroke="red" strokeWidth={1}>
        <line
          x1={left + width / 2 - 10}
          y1={top + height / 2}
          x2={left + width / 2 + 10}
          y2={top + height / 2}
        />
        <line
          x1={left + width / 2}
          y1={top + height / 2 - 10}
          x2={left + width / 2}
          y2={top + height / 2 + 10}
        />
      </g>

      {/* Info text */}
      <text
        x={left + 10}
        y={top + 20}
        fontSize="12"
        fill="red"
        fontFamily="monospace"
      >
        Drawing Area: {width}×{height}
      </text>
      <text
        x={left + 10}
        y={top + 35}
        fontSize="12"
        fill="red"
        fontFamily="monospace"
      >
        Center: ({left + width / 2}, {top + height / 2})
      </text>
    </g>
  );
}

export default function UseDrawingArea() {
  return (
    <LineChart
      dataset={[
        { x: 1, y: 2 },
        { x: 2, y: 5 },
        { x: 3, y: 3 },
        { x: 4, y: 8 },
        { x: 5, y: 1 },
        { x: 6, y: 7 },
      ]}
      xAxis={[{ dataKey: 'x', label: 'X Axis' }]}
      yAxis={[{ label: 'Y Axis' }]}
      series={[{ dataKey: 'y', label: 'Sample Data', color: '#8884d8' }]}
      height={400}
      hideLegend
    >
      <CustomOverlay />
    </LineChart>
  );
}
