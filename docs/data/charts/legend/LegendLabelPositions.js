import * as React from 'react';
import { interpolateRdYlBu } from 'd3-scale-chromatic';
import { ContinuousColorLegend } from '@mui/x-charts/ChartsLegend';
import { ChartDataProvider } from '@mui/x-charts/context';
import { ChartsAxesGradients } from '@mui/x-charts/internals';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function LegendLabelPositions() {
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
    >
      <Stack direction="column" width="100%" gap={2}>
        <Typography>horizontal</Typography>
        <Stack direction="row" width="100%" gap={2} sx={{ '&>div': { flex: 1 } }}>
          <div>
            <Typography variant="caption">above</Typography>
            <ContinuousColorLegend
              axisDirection="y"
              direction="horizontal"
              labelPosition="above"
            />
          </div>
          <div>
            <Typography variant="caption">below</Typography>
            <ContinuousColorLegend
              axisDirection="y"
              direction="horizontal"
              labelPosition="below"
            />
          </div>
          <div>
            <Typography variant="caption">extremes</Typography>
            <ContinuousColorLegend
              axisDirection="y"
              direction="horizontal"
              labelPosition="extremes"
            />
          </div>
        </Stack>
        <Typography>vertical</Typography>
        <Stack
          direction="row"
          width="100%"
          height={150}
          gap={2}
          sx={{
            '&>div': { flex: 1 },
            '& .MuiContinuousColorLegend-root': { height: 100 },
          }}
        >
          <div>
            <Typography variant="caption">left</Typography>
            <ContinuousColorLegend
              axisDirection="y"
              direction="vertical"
              labelPosition="left"
            />
          </div>
          <div>
            <Typography variant="caption">right</Typography>
            <ContinuousColorLegend
              axisDirection="y"
              direction="vertical"
              labelPosition="right"
            />
          </div>
          <div>
            <Typography variant="caption">extremes</Typography>
            <ContinuousColorLegend
              axisDirection="y"
              direction="vertical"
              labelPosition="extremes"
            />
          </div>
        </Stack>
      </Stack>
      <svg width={0} height={0}>
        <ChartsAxesGradients />
      </svg>
    </ChartDataProvider>
  );
}
