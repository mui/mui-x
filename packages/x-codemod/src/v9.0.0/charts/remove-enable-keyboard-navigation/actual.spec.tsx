// @ts-nocheck
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';
import { FunnelChart } from '@mui/x-charts-pro/FunnelChart';

const enabled = true;

<div>
  <BarChart enableKeyboardNavigation series={[]} />
  <LineChart enableKeyboardNavigation={true} series={[]} />
  <PieChart enableKeyboardNavigation series={[]} />
  <ScatterChart enableKeyboardNavigation series={[]} />
  <ScatterChart enableKeyboardNavigation={false} series={[]} />
  <ScatterChart enableKeyboardNavigation={enabled} series={[]} />
  <BarChartPro enableKeyboardNavigation series={[]} />
  <FunnelChart enableKeyboardNavigation series={[]} />
</div>;
