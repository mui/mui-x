import * as React from 'react';
import { BarPlot } from '@mui/x-charts/BarChart';
import { LinePlot } from '@mui/x-charts/LineChart';
import { DrawingProvider } from '@mui/x-charts/context/DrawingProvider';
import { SeriesContextProvider } from '@mui/x-charts/context/SeriesContextProvider';
import { CartesianContextProvider } from '@mui/x-charts/context/CartesianContextProvider';
import Surface from '@mui/x-charts/Surface';
import XAxis from '@mui/x-charts/XAxis/XAxis';
import YAxis from '@mui/x-charts/YAxis/YAxis';

const xAxis = [
  {
    id: 'years',
    data: [2010, 2011, 2012, 2013, 2014],
    scale: 'band',
  },
];

const yAxis = [
  {
    id: 'eco',
    scale: 'linear',
  },
  {
    id: 'pib',
    scale: 'log',
  },
];

const series = [
  {
    type: 'bar',
    id: 'Eco-1',
    stack: '',
    xAxisKey: 'years',
    yAxisKey: 'eco',
    data: [2, 5, 3, 4, 1],
  },
  {
    type: 'bar',
    id: 'Eco-1',
    stack: '',
    xAxisKey: 'years',
    yAxisKey: 'eco',
    data: [5, 6, 2, 8],
  },
  {
    type: 'line',
    id: 'pib',
    xAxisKey: 'years',
    yAxisKey: 'pib',
    data: [1000, 1500, 3000, 5000],
  },
];

// Components that could be exported
function ChartContainer({ width, height, series, margin, children }) {
  return (
    <DrawingProvider width={width} height={height} margin={margin}>
      <SeriesContextProvider series={series}>
        <Surface width={width} height={height}>
          {children}
        </Surface>
      </SeriesContextProvider>
    </DrawingProvider>
  );
}

export default function Composition() {
  return (
    <ChartContainer series={series} width={500} height={500}>
      <CartesianContextProvider xAxis={xAxis} yAxis={yAxis}>
        <BarPlot />
        <LinePlot />
        <XAxis label="Bottom X axis" position="bottom" />
        <XAxis label="Top X axis" position="top" />
        <YAxis label="Left Y axis" position="left" axisId="leftAxis" />
        <YAxis label="Right Y axis" position="right" />
      </CartesianContextProvider>
    </ChartContainer>
  );
}
