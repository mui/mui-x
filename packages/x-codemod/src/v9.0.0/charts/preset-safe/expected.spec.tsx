// @ts-nocheck
/* eslint-disable */
import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarPlot, BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import {
  Position,
  AllSeriesType,
  DefaultizedSeriesType,
  CartesianChartSeriesType,
  StackableChartSeriesType,
} from '@mui/x-charts/models';
import {
  useSeries,
  usePieSeries,
  useLineSeries,
  useBarSeries,
  useScatterSeries,
} from '@mui/x-charts/hooks';
import { useHeatmapSeries } from '@mui/x-charts-pro/hooks';
import { ChartsContainer } from '@mui/x-charts';
import { ChartsContainerProps } from '@mui/x-charts/ChartsContainer';

import { ChartApi } from '@mui/x-charts/context';

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
    <Heatmap series={[{}]} hideLegend />
    <HeatmapPremium series={[{}]} hideLegend={false} />
    <Heatmap hideLegend series={[{}]} />
    <HeatmapPremium hideLegend {...otherProps} />
    <PieArc seriesId="test" />
    <LineChart series={[{
      data: [1, 2, 3],
      showMark: true,
    }]} />
    <ChartsDataProvider series={[{
      type: 'line',
      data: [1, 2, 3],
      showMark: true,
    }]} />
    <ChartsContainer />
  </div>;
}

function processCartesian(series: AllSeriesType<CartesianChartSeriesType>) {
  console.log(series);
}

function processDefaultizedCartesian(series: DefaultizedSeriesType<CartesianChartSeriesType>) {
  console.log(series);
}

function processStackable(series: DefaultizedSeriesType<StackableChartSeriesType>) {
  console.log(series);
}

function processAll(series: AllSeriesType) {
  if (series.type === 'bar') {
    console.log('bar series');
  }
  if (series.type === 'bar') {
    console.log('defaultized bar series');
  }
}
