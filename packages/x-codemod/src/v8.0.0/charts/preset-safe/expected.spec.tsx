// @ts-nocheck
import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import {
  useSeries,
  usePieSeries,
  useLineSeries,
  useBarSeries,
  useScatterSeries,
} from '@mui/x-charts/hooks';

function App() {
  const series = useSeries();
  const pieSeries = usePieSeries();
  const lineSeries = useLineSeries();
  const barSeries = useBarSeries();
  const scatterSeries = useScatterSeries();

  // prettier-ignore
  <div>
    <PieChart
      slotProps={{
        legend: { hidden: true }
      }} />
    <PieChart
      slotProps={{
        tooltip: { trigger: 'axis' },
        legend: { hidden: true }
      }} />
    <ChartContainer>
      <BarPlot />
    </ChartContainer>
  </div>;
}
