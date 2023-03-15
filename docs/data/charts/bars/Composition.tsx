import * as React from 'react';
import { BarPlot } from '@mui/x-charts/BarChart';
import { LinePlot } from '@mui/x-charts/LineChart';
import { DrawingProvider } from '@mui/x-charts/context/DrawingProvider';
import { SeriesContextProvider } from '@mui/x-charts/context/SeriesContextProvider';
import { CartesianContextProvider } from '@mui/x-charts/context/CartesianContextProvider';
import Surface from '@mui/x-charts/Surface';
import XAxis from '@mui/x-charts/XAxis/XAxis';
import YAxis from '@mui/x-charts/YAxis/YAxis';

const series = [
  {
    type: 'bar',
    id: 'Eco-1',
    stack: '',
    xAxisKey: 'years',
    yAxisKey: 'eco',
    color: 'red',
    data: [2, 5, 3, 4, 1],
  },
  {
    type: 'bar',
    id: 'Eco-2',
    stack: '',
    xAxisKey: 'years',
    yAxisKey: 'eco',
    color: 'blue',
    data: [5, 6, 2, 8, 9],
  },
  {
    type: 'line',
    id: 'pib',
    xAxisKey: 'years',
    yAxisKey: 'pib',
    data: [1000, 1500, 3000, 5000, 10000],
  },
];

// Components that could be exported
function ChartContainer(props: any) {
  const { width, height, series: innerSerries, margin, children } = props;

  return (
    <DrawingProvider width={width} height={height} margin={margin}>
      <SeriesContextProvider series={innerSerries}>
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
      <CartesianContextProvider
        xAxis={[
          {
            id: 'years',
            data: [2010, 2011, 2012, 2013, 2014],
            scaleName: 'band',
          },
        ]}
        yAxis={[
          {
            id: 'eco',
            scaleName: 'linear',
          },
          {
            id: 'pib',
            scaleName: 'log',
          },
        ]}
      >
        <BarPlot />
        <LinePlot />
        <XAxis label="Years" position="bottom" axisId="years" />
        <YAxis label="Results" position="left" axisId="eco" />
        <YAxis label="PIB" position="right" axisId="pib" />
      </CartesianContextProvider>
    </ChartContainer>
  );
}
