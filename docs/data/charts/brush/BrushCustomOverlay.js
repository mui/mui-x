import { LineChart } from '@mui/x-charts/LineChart';
import {
  useBrush,
  useDrawingArea,
  useLineSeries,
  useXScale,
} from '@mui/x-charts/hooks';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function CustomBrushOverlay() {
  const theme = useTheme();
  const drawingArea = useDrawingArea();
  const brush = useBrush();
  const xScale = useXScale();
  const series = useLineSeries('marketValue');

  if (!brush || !series) {
    return null;
  }

  const { left, top, width, height } = drawingArea;

  // Clamp coordinates to drawing area
  const clampX = (x) => Math.max(left, Math.min(left + width, x));
  const clampedStartX = clampX(brush.start.x);
  const clampedCurrentX = clampX(brush.current.x);

  const minX = Math.min(clampedStartX, clampedCurrentX);
  const maxX = Math.max(clampedStartX, clampedCurrentX);
  const rectWidth = maxX - minX;

  const color = theme.palette.primary.main;

  if (rectWidth < 1) {
    return null;
  }

  const getIndex = (x) =>
    Math.floor(
      (x - Math.min(...xScale.range()) + xScale.step() / 2) / xScale.step(),
    );
  // Calculate the approximate data indices based on x position
  const startIndex = getIndex(clampedStartX);
  const currentIndex = getIndex(clampedCurrentX);

  const startValue = series.data[startIndex];
  const currentValue = series.data[currentIndex];
  const difference = currentValue - startValue;
  const percentChange = ((difference / startValue) * 100).toFixed(2);

  // Get the date labels
  const startDate = xScale.domain()[startIndex] || '';
  const currentDate = xScale.domain()[currentIndex] || '';

  return (
    <g>
      {/* Start line */}
      <line
        x1={clampedStartX}
        y1={top}
        x2={clampedStartX}
        y2={top + height}
        stroke={color}
        strokeWidth={2}
        strokeDasharray="5,5"
        pointerEvents="none"
      />
      {/* Current line */}
      <line
        x1={clampedCurrentX}
        y1={top}
        x2={clampedCurrentX}
        y2={top + height}
        stroke={color}
        strokeWidth={2}
        strokeDasharray="5,5"
        pointerEvents="none"
      />
      {/* Selection rectangle */}
      <rect
        x={minX}
        y={top}
        width={rectWidth}
        height={height}
        fill={color}
        fillOpacity={0.1}
        pointerEvents="none"
      />
      {/* Start label */}
      <g transform={`translate(${clampedStartX}, ${top + 15})`}>
        <rect x={-30} y={0} width={60} height={40} fill={color} rx={4} />
        {/* Date label */}
        <text x={0} y={16} textAnchor="middle" fill="white" fontSize={10}>
          {startDate}
        </text>
        {/* Value label */}
        <text
          x={0}
          y={32}
          textAnchor="middle"
          fill="white"
          fontSize={11}
          fontWeight="bold"
        >
          {startValue.toFixed(2)}
        </text>
      </g>

      {/* End label */}
      <g transform={`translate(${clampedCurrentX}, ${top + 15})`}>
        <rect x={-30} y={0} width={60} height={40} fill={color} rx={4} />
        {/* Date label */}
        <text x={0} y={16} textAnchor="middle" fill="white" fontSize={10}>
          {currentDate}
        </text>
        {/* Value label */}
        <text
          x={0}
          y={32}
          textAnchor="middle"
          fill="white"
          fontSize={11}
          fontWeight="bold"
        >
          {currentValue.toFixed(2)}
        </text>
      </g>

      {/* Difference label in the middle */}
      <g transform={`translate(${(minX + maxX) / 2}, ${top + height - 30})`}>
        <rect
          x={-50}
          y={0}
          width={100}
          height={26}
          fill={
            difference >= 0 ? theme.palette.success.main : theme.palette.error.main
          }
          rx={4}
        />
        <text
          x={0}
          y={17}
          textAnchor="middle"
          fill="white"
          fontSize={12}
          fontWeight="bold"
        >
          {difference >= 0 ? '+' : ''}
          {difference.toFixed(2)} ({percentChange}%)
        </text>
      </g>
    </g>
  );
}

const marketData = [
  100, 96.56, 97.04, 98.95, 102.66, 106.18, 107.76, 109.78, 113.57, 111.54, 107.69,
  104.58, 106.62, 103.81, 104.46, 105.14, 108.94, 112.81, 112.62, 117.52, 122.17,
  122.11, 121.44, 122.5, 125.42, 127.46, 129.21, 124.71, 125.0, 125.28, 125.15,
  125.06, 120.48, 115.83, 116.47, 119.58, 118.99, 123.46, 126.83, 130.84, 131.12,
  131.31, 129.14, 133.35, 130.15, 129.02, 132.57, 136.1, 139.33, 139.66,
];

const dates = Array.from({ length: 50 }, (_, i) => {
  const date = new Date(2024, 0, i + 1);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
});

export default function BrushCustomOverlay() {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="body2" sx={{ mb: 2 }}>
        Custom brush overlay showing the values at start and end positions, and the
        difference between them.
      </Typography>
      <LineChart
        height={300}
        series={[
          {
            data: marketData,
            label: 'Market Value',
            showMark: false,
            id: 'marketValue',
          },
        ]}
        brushConfig={{ enabled: true }}
        xAxis={[
          {
            data: dates,
            scaleType: 'point',
          },
        ]}
      >
        <CustomBrushOverlay />
      </LineChart>
    </Box>
  );
}
