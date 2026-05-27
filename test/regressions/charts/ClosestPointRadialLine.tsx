import * as React from 'react';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { UseChartPolarAxisSignature, useChartsContext } from '@mui/x-charts/internals';
import { getRadialLineItemAtPosition } from '@mui/x-charts-premium/internals';
import { Unstable_RadialLineChart as RadialLineChart } from '@mui/x-charts-premium/RadialLineChart';

const HEIGHT = 200;
const WIDTH = 200;

const series = [
  {
    data: [3, 4, 1, 6, 5],
    label: 'A',
    stack: 'total',
  },
  {
    data: [4, 3, 1, 5, 8],
    label: 'B',
    stack: 'total',
  },
  {
    data: [4, 2, 5, 4, 1],
    label: 'C',
    stack: 'total',
  },
];

const CURVES = ['natural', 'linear', 'catmullRom'] as const;
const SCALES = ['linear', 'point', 'band'] as const;
export default function ClosestPointRadialLine() {
  return (
    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
      {CURVES.map((curve) => (
        <div key={curve}>
          {SCALES.map((scaleType) => {
            return (
              <div key={scaleType}>
                <p>
                  {curve} / {scaleType}
                </p>
                <RadialLineChart
                  hideLegend
                  rotationAxis={[
                    {
                      scaleType: scaleType as 'linear' | 'point' | 'band',
                      data: [1, 2, 5, 8, 13],
                    },
                  ]}
                  radiusAxis={[{ minRadius: 10 }]}
                  height={HEIGHT}
                  width={WIDTH}
                  grid={{ rotation: true, radius: true }}
                  series={series.map((s) => ({
                    ...s,
                    curve: curve as 'natural' | 'linear' | 'catmullRom',
                    area: true,
                  }))}
                >
                  <Dots />
                </RadialLineChart>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

const X_STEP = 5;
const Y_STEP = 5;

function Dots() {
  const { store } = useChartsContext<[UseChartPolarAxisSignature]>();
  const { left, top, right, bottom, width, height } = useDrawingArea();
  const dots = [];

  for (let x = 0; x < width + left + right; x += X_STEP) {
    for (let y = 0; y < height + top + bottom; y += Y_STEP) {
      const item = getRadialLineItemAtPosition(store.state, { x, y });

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
