import * as React from 'react';
import { ChartsDataProvider } from '@mui/x-charts/ChartsDataProvider';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { useDrawingArea } from '@mui/x-charts/hooks';
import {
  getLineItemAtPosition,
  UseChartCartesianAxisSignature,
  useChartsContext,
} from '@mui/x-charts/internals';
import { AreaPlot, LinePlot } from '@mui/x-charts/LineChart';

const HEIGHT = 150;
const WIDTH = 300;

export default function ClosestPointLine() {
  return (
    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
      {['linear', 'point', 'band'].map((scaleType) => {
        return (
          <div key={scaleType}>
            <p>x-scale: {scaleType}</p>
            <ChartsDataProvider
              xAxis={[
                {
                  scaleType: scaleType as 'linear' | 'point' | 'band',
                  data: [1, 2, 3, 5, 8, 10, 12, 15, 16, 18, 20],
                  position: 'none',
                },
              ]}
              yAxis={[{ position: 'none' }]}
              series={[
                {
                  type: 'line',
                  data: [2, 5, 6.5, 3, 8, 10, 10, 9.5, 2.5, 6, 10, 8],
                },
                {
                  type: 'line',
                  data: [1, 2, 3, 1, 2, 3, 1, 1, 2, 3, 1, 2],
                  area: true,
                  stack: 'stack1',
                  id: 'yellow',
                },
                {
                  type: 'line',
                  data: [null, null, 5.5, 2, null, null, null, 8.5, 1.5, 5],
                  connectNulls: true,
                  area: true,
                  stack: 'stack1',
                  id: 'red',
                },
                {
                  type: 'line',
                  data: [null, 13, 5.5, 7, null, 10, 8.5, 5],
                  connectNulls: false,
                  stack: 'stack1',
                  highlightScope: { highlight: 'series', fade: 'global' },
                  id: 'lightblue',
                },
              ]}
              height={HEIGHT}
              width={WIDTH}
              margin={10}
              skipAnimation
              experimentalFeatures={{ enablePositionBasedPointerInteraction: true }}
            >
              <ChartsSurface>
                <g style={{ opacity: 0.6 }}>
                  <AreaPlot />
                  <LinePlot />
                </g>
                <Dots />
              </ChartsSurface>
            </ChartsDataProvider>
          </div>
        );
      })}
    </div>
  );
}

const X_STEP = 5;
const Y_STEP = 5;

function Dots() {
  const { store } = useChartsContext<[UseChartCartesianAxisSignature]>();
  const { left, top, right, bottom, width, height } = useDrawingArea();
  const dots = [];

  for (let x = 0; x < width + left + right; x += X_STEP) {
    for (let y = 0; y < height + top + bottom; y += Y_STEP) {
      const item = getLineItemAtPosition(store.state, { x, y });

      if (!item) {
        dots.push({ x, y, color: 'lightgray' });
      } else {
        const seriesColor =
          store.state.series.defaultizedSeries[item.type]?.series[item.seriesId].color || 'black';
        dots.push({ x, y, color: seriesColor });
      }
    }
  }
  return (
    <g>
      {dots.map((dot, index) => (
        <circle key={index} cx={dot.x} cy={dot.y} r={2} fill={dot.color} opacity={0.5} />
      ))}
    </g>
  );
}
