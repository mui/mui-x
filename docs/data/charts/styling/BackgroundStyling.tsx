import { useTheme } from '@mui/material/styles';
import { LinePlot } from '@mui/x-charts/LineChart';
import { XAxis } from '@mui/x-charts/models';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsGrid } from '@mui/x-charts/ChartsGrid';
import { useDrawingArea } from '@mui/x-charts/hooks';
import {
  dateAxisFormatter,
  percentageFormatter,
  usUnemploymentRate,
} from '../dataset/usUnemploymentRate';

function Background() {
  const drawingArea = useDrawingArea();
  const theme = useTheme();
  return (
    <rect
      x={drawingArea.left}
      y={drawingArea.top}
      width={drawingArea.width}
      height={drawingArea.height}
      fill={theme.palette.mode === 'light' ? '#f5f5f5' : '#303030'}
    />
  );
}

export default function BackgroundStyling() {
  return (
    <ChartContainer
      dataset={usUnemploymentRate}
      xAxis={xAxis}
      yAxis={yAxis}
      series={series}
      height={300}
    >
      <Background />
      <ChartsGrid vertical horizontal />
      <LinePlot />
      <ChartsXAxis />
      <ChartsYAxis />
    </ChartContainer>
  );
}

const xAxis: XAxis<'time'>[] = [
  {
    dataKey: 'date',
    scaleType: 'time',
    valueFormatter: dateAxisFormatter,
  },
];
const yAxis = [
  {
    valueFormatter: percentageFormatter,
  },
];
const series = [
  {
    type: 'line' as const,
    dataKey: 'rate',
    showMark: false,
    valueFormatter: percentageFormatter,
  },
];
