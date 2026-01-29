// @ts-nocheck
import { Unstable_SankeyChart } from '@mui/x-charts-pro/SankeyChart';
import { Unstable_SankeyChart as SankeyChartPro } from '@mui/x-charts-pro/SankeyChart';
// Should rename Unstable_SankeyChart to SankeyChart
import { Unstable_SankeyChart as MySankeyChart, SankeyChartProps } from '@mui/x-charts-pro/SankeyChart';

function MyComponent() {
  return <Unstable_SankeyChart />;
}

function MyComponentWithAlias() {
  return <SankeyChartPro />;
}

function MyComponentWithCustomAlias() {
  return <MySankeyChart />;
}