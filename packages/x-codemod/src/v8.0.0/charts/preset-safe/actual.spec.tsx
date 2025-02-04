// @ts-nocheck
import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';
import {
  unstable_useSeries,
  unstable_usePieSeries,
  unstable_useLineSeries,
  unstable_useBarSeries,
  unstable_useScatterSeries,
} from '@mui/x-charts/hooks';

function App() {
  const series = unstable_useSeries();
  const pieSeries = unstable_usePieSeries();
  const lineSeries = unstable_useLineSeries();
  const barSeries = unstable_useBarSeries();
  const scatterSeries = unstable_useScatterSeries();

  // prettier-ignore
  <div>
    <PieChart legend={{ hidden: true }} />
    <PieChart legend={{ hidden: true }} slotProps={{ tooltip: { trigger: 'axis' } }} />
    <ResponsiveChartContainer>
      <BarPlot />
    </ResponsiveChartContainer>
  </div>;
}
