// @ts-nocheck
import { SankeyChart } from '@mui/x-charts-pro/SankeyChart';
import { SankeyChart as SankeyChartPro } from '@mui/x-charts-pro/SankeyChart';
// Should rename Unstable_SankeyChart to SankeyChart
import { SankeyChart as MySankeyChart, SankeyChartProps } from '@mui/x-charts-pro/SankeyChart';

function MyComponent() {
  return <SankeyChart />;
}

function MyComponentWithAlias() {
  return <SankeyChartPro />;
}

function MyComponentWithCustomAlias() {
  return <MySankeyChart />;
}
