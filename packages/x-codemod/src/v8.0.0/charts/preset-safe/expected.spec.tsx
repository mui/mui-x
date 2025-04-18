// @ts-nocheck
import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarPlot, BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { Position } from '@mui/x-charts/models';
import {
  useSeries,
  usePieSeries,
  useLineSeries,
  useBarSeries,
  useScatterSeries,
} from '@mui/x-charts/hooks';
import { useHeatmapSeries } from '@mui/x-charts-pro/hooks';

function App() {
  const series = useSeries();
  const pieSeries = usePieSeries();
  const lineSeries = useLineSeries();
  const barSeries = useBarSeries();
  const scatterSeries = useScatterSeries();
  const heatmapSeries = useHeatmapSeries();

  // prettier-ignore
  <div>
  <PieChart
    hideLegend={true} />
  <PieChart
    slotProps={{
      tooltip: { trigger: 'axis' }
    }}
    hideLegend={true} />
  <ChartContainer onAxisClick={onAxisClickHandler}>

    <BarPlot />
  </ChartContainer>
  <ChartsXAxis
    labelStyle={{
      fontSize: 18
    }}
    tickStyle={{
      fontSize: 20
    }} />
  <ChartsXAxis
    labelStyle={{
      fontWeight: 'bold',
      fontSize: 18
    }}
    tickStyle={{
      fontWeight: 'bold',
      fontSize: 20
    }} />
  <ChartsXAxis
    labelStyle={{
      fontWeight: 'bold',
      fontSize: 10
    }}
    tickStyle={{
      fontWeight: 'bold',
      fontSize: 12
    }} />
  <LineChart series={[{}]} />
  <BarChart
    slotProps={{
      legend: {
        direction: "horizontal"
      }
    }} />
  <BarChart
    slotProps={{
      legend: {
        direction: "vertical",

        position: {
          vertical: 'top',
          horizontal: "center"
        }
      }
    }} />
  <BarChart
    slotProps={{
      legend: {
        direction: 'wrong'
      }
    }} />
  <BarChart
    slotProps={{
      legend: {
        position: {
          vertical: 'middle',
          horizontal: "start"
        }
      }
    }} />
  <BarChart
    slotProps={{
      legend: {
        position: {
          vertical: 'top',
          horizontal: "center"
        }
      }
    }} />
  <BarChart
    slotProps={{
      legend: {
        position: {
          vertical: 'bottom',
          horizontal: "end"
        }
      }
    }} />
  <BarChart
    slotProps={{
      legend: {
        position: {
          vertical: 'wrong',
          horizontal: 'wrong'
        }
      }
    }} />
  </div>;
}
