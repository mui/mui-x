import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { ChartDataProvider } from '@mui/x-charts/ChartDataProvider';
import {
  ChartsLegend,
  ContinuousColorLegend,
  PiecewiseColorLegend,
} from '@mui/x-charts/ChartsLegend';
import { sxColors } from '../colors';

export default function Legends() {
  return (
    <Box sx={{ ...sxColors, p: 1 }}>
      <ChartDataProvider
        colors={['var(--palette-color-0)', 'var(--palette-color-3)']}
        series={[
          { type: 'bar', label: 'Bar', data: [] },
          { type: 'line', label: 'Line', data: [] },
        ]}
        xAxis={[
          {
            scaleType: 'linear',
            disableLine: true,
            colorMap: {
              type: 'piecewise',
              thresholds: [0, 1, 2, 3, 4],
              colors: [
                'var(--palette-color-0)',
                'var(--palette-color-1)',
                'var(--palette-color-2)',
                'var(--palette-color-3)',
                'var(--palette-color-4)',
                'var(--palette-color-5)',
              ],
            },
          },
        ]}
        width={400}
        height={60}
      >
        <Stack direction="row" spacing={1}>
          <ChartsLegend direction="horizontal" />
          <div style={{ flexGrow: 1 }}>
            <PiecewiseColorLegend
              direction="horizontal"
              axisDirection="x"
              labelPosition="extremes"
              labelFormatter={({ min, max }) =>
                (min === null && 'min') || (max === null && 'max') || ''
              }
            />
          </div>
        </Stack>
      </ChartDataProvider>

      <ChartDataProvider
        colors={['var(--palette-color-0)', 'var(--palette-color-3)']}
        series={[
          { type: 'pie', data: [{ value: 0, label: 'Pie' }] },
          {
            type: 'line',
            label: 'Line',
            data: [],
            labelMarkType: ({ color }) => (
              <svg viewBox="0 0 24 24" style={{ height: '100%', width: '100%' }}>
                <path
                  stroke={color}
                  strokeWidth={3}
                  d="M 2 12 L 7 12 M 17 12 L 22 12"
                  strokeLinecap="round"
                />
                <circle cx={12} cy={12} r={5} stroke={color} strokeWidth={3} fill="none" />
              </svg>
            ),
          },
        ]}
        xAxis={[
          {
            scaleType: 'linear',
            data: [0, 10],
            disableLine: true,
            colorMap: {
              type: 'continuous',
              min: 0,
              max: 100,
              color: ['var(--palette-color-0)', 'var(--palette-color-2)'],
            },
          },
        ]}
        width={400}
        height={60}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <ChartsLegend direction="horizontal" />
          <div style={{ flexGrow: 1 }}>
            <ContinuousColorLegend
              direction="horizontal"
              axisDirection="x"
              labelPosition="extremes"
              minLabel="min"
              maxLabel="max"
              gradientId="test"
            />
            <svg style={{ position: 'absolute', height: 0, width: 0 }}>
              {/* The gradient had to be done manually to support CSS vars */}
              <linearGradient
                id="test"
                x1="0"
                x2="1"
                y1="0"
                y2="0"
                gradientUnits="objectBoundingBox"
              >
                <stop offset={0} stopColor="var(--palette-color-0)" stopOpacity={1} />;
                <stop offset={1} stopColor="var(--palette-color-5)" stopOpacity={1} />;
              </linearGradient>
            </svg>
          </div>
        </Stack>
      </ChartDataProvider>
    </Box>
  );
}
