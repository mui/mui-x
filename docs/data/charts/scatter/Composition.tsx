import * as React from 'react';
import { ScatterPlot } from '@mui/x-charts/ScatterChart';
import { DrawingProvider } from '@mui/x-charts/context/DrawingProvider';
import { SeriesContextProvider } from '@mui/x-charts/context/SeriesContextProvider';
import { CartesianContextProvider } from '@mui/x-charts/context/CartesianContextProvider';
import Surface from '@mui/x-charts/Surface';
import { XAxis } from '@mui/x-charts/XAxis';
import { YAxis } from '@mui/x-charts/YAxis';

// Components that could be exported
function ChartContainer({ width, height, series, margin, children }: any) {
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
    <ChartContainer
      series={[
        {
          type: 'scatter',
          id: 's1',
          yAxisKey: 'leftAxis',
          markerSize: 5,
          data: [
            { x: 0, y: 0, id: 0 },
            { x: 1, y: 1, id: 1 },
            { x: 2, y: 2, id: 2 },
            { x: 3, y: 3, id: 3 },
            { x: 4, y: 4, id: 4 },
            { x: 1, y: -1, id: 21 },
            { x: 2, y: -2, id: 22 },
            { x: 3, y: -3, id: 23 },
          ],
        },
        {
          type: 'scatter',
          id: 's2',
          markerSize: 5,
          data: [
            { x: 0, y: 0, id: 0 },
            { x: 1, y: 1, id: 1 },
            { x: 2, y: 2, id: 2 },
            { x: 3, y: 3, id: 3 },
            { x: 4, y: 4, id: 4 },
          ],
        },
      ]}
      width={500}
      height={500}
    >
      <CartesianContextProvider
        yAxis={[
          {
            id: 'leftAxis',

            max: 4,
            scaleName: 'sqrt',
          },
        ]}
      >
        <ScatterPlot />
        <XAxis label="Bottom X axis" position="bottom" />
        <XAxis label="Top X axis" position="top" />
        <YAxis label="Left Y axis" position="left" axisId="leftAxis" />
        <YAxis label="Right Y axis" position="right" />
      </CartesianContextProvider>
    </ChartContainer>
  );
}
