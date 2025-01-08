import * as React from 'react';
import { interpolateRdYlBu } from 'd3-scale-chromatic';
import {
  ContinuousColorLegend,
  piecewiseColorDefaultLabelFormatter,
  PiecewiseColorLegend,
} from '@mui/x-charts/ChartsLegend';
import { ChartDataProvider } from '@mui/x-charts/context';
import { ChartsAxesGradients } from '@mui/x-charts/internals';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

export default function LegendLabelPositions() {
  const piecewiseFormatter = (params) =>
    params.index === 0 || params.index === params.length
      ? piecewiseColorDefaultLabelFormatter(params)
      : '';

  return (
    <ChartDataProvider
      series={[]}
      width={200}
      height={200}
      yAxis={[
        {
          valueFormatter: (value) => `${value}°`,
          colorMap: {
            type: 'continuous',
            min: -0.5,
            max: 1.5,
            color: (t) => interpolateRdYlBu(1 - t),
          },
        },
      ]}
      xAxis={[
        {
          valueFormatter: (value) => `${value}°`,
          colorMap: {
            type: 'piecewise',
            thresholds: [0, 1.5],
            colors: [
              interpolateRdYlBu(0.9),
              interpolateRdYlBu(0.5),
              interpolateRdYlBu(0.1),
            ],
          },
        },
      ]}
    >
      <Stack direction="column" width="100%" height="100%" gap={4} spacing={2}>
        <Stack direction="column" width="100%" height="100%" gap={2}>
          <Typography variant="h4">Continuous</Typography>
          <Typography variant="h5">Horizontal</Typography>
          <Stack direction="row" gap={2} sx={{ '&>div': { flex: 1 } }}>
            <div>
              <Typography>start</Typography>
              <ContinuousColorLegend
                axisDirection="y"
                direction="horizontal"
                labelPosition="start"
              />
            </div>
            <div>
              <Typography>end</Typography>
              <ContinuousColorLegend
                axisDirection="y"
                direction="horizontal"
                labelPosition="end"
              />
            </div>
            <div>
              <Typography>extremes</Typography>
              <ContinuousColorLegend
                axisDirection="y"
                direction="horizontal"
                labelPosition="extremes"
              />
            </div>
          </Stack>
          <Divider />
          <Typography variant="h5">Vertical</Typography>
          <Stack
            direction="row"
            height={150}
            gap={2}
            sx={{
              '&>div': {
                flex: 1,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              },
              '& .MuiContinuousColorLegend-root': { flex: 1 },
            }}
          >
            <div>
              <Typography>start</Typography>
              <ContinuousColorLegend
                axisDirection="y"
                direction="vertical"
                labelPosition="start"
              />
            </div>
            <div>
              <Typography>end</Typography>
              <ContinuousColorLegend
                axisDirection="y"
                direction="vertical"
                labelPosition="end"
              />
            </div>
            <div>
              <Typography>extremes</Typography>
              <ContinuousColorLegend
                axisDirection="y"
                direction="vertical"
                labelPosition="extremes"
              />
            </div>
          </Stack>
        </Stack>
        <Stack direction="column" width="100%" height="100%" gap={2}>
          <Typography variant="h4">Piecewise</Typography>
          <Typography variant="h5">Horizontal</Typography>
          <Stack direction="row" gap={2} sx={{ '&>div': { flex: 1 } }}>
            <div>
              <Typography>start</Typography>
              <PiecewiseColorLegend
                axisDirection="x"
                direction="horizontal"
                labelPosition="start"
                labelFormatter={piecewiseFormatter}
              />
            </div>
            <div>
              <Typography>end</Typography>
              <PiecewiseColorLegend
                axisDirection="x"
                direction="horizontal"
                labelPosition="end"
                labelFormatter={piecewiseFormatter}
              />
            </div>
            <div>
              <Typography>extremes</Typography>
              <PiecewiseColorLegend
                axisDirection="x"
                direction="horizontal"
                labelPosition="extremes"
                labelFormatter={piecewiseFormatter}
              />
            </div>
          </Stack>
          <Divider />
          <Typography variant="h5">Vertical</Typography>
          <Stack
            direction="row"
            height={150}
            gap={2}
            sx={{
              '&>div': {
                flex: 1,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              },
            }}
          >
            <div>
              <Typography>start</Typography>
              <PiecewiseColorLegend
                axisDirection="x"
                direction="vertical"
                labelPosition="start"
              />
            </div>
            <div>
              <Typography>end</Typography>
              <PiecewiseColorLegend
                axisDirection="x"
                direction="vertical"
                labelPosition="end"
              />
            </div>
            <div>
              <Typography>extremes</Typography>
              <PiecewiseColorLegend
                axisDirection="x"
                direction="vertical"
                labelPosition="extremes"
                labelFormatter={piecewiseFormatter}
              />
            </div>
          </Stack>
        </Stack>
      </Stack>
      <svg width={0} height={0}>
        <ChartsAxesGradients />
      </svg>
    </ChartDataProvider>
  );
}
