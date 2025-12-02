import * as React from 'react';
import { BarPlot } from '@mui/x-charts/BarChart';
import { LinePlot, MarkPlot } from '@mui/x-charts/LineChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { useChartRootRef } from '@mui/x-charts/hooks';
import Button from '@mui/material/Button';
import { Stack } from '@mui/system';
import { ChartDataProviderPro } from '@mui/x-charts-pro/ChartDataProviderPro';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsLegend } from '@mui/x-charts/ChartsLegend';
import { useChartProApiRef } from '@mui/x-charts-pro/hooks';
import Typography from '@mui/material/Typography';

function CustomChartWrapper({ children }) {
  const chartRootRef = useChartRootRef();

  return (
    <div
      ref={chartRootRef}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      {children}
    </div>
  );
}

export default function ExportCompositionNoSnap() {
  const apiRef = useChartProApiRef();

  return (
    <Stack width="100%" sx={{ display: 'block' }}>
      <Button
        onClick={() => apiRef.current.exportAsPrint()}
        variant="contained"
        sx={{ mb: 1 }}
      >
        Print
      </Button>
      <ChartDataProviderPro
        apiRef={apiRef}
        height={300}
        series={[
          {
            type: 'bar',
            data: [1, 2, 3, 2, 1],
            label: 'Bar',
          },
          {
            type: 'line',
            data: [4, 3, 1, 3, 4],
            label: 'Line',
          },
        ]}
        xAxis={[
          {
            data: ['A', 'B', 'C', 'D', 'E'],
            scaleType: 'band',
            id: 'x-axis-id',
            height: 24,
          },
        ]}
        yAxis={[{ width: 20 }]}
        margin={{ bottom: 0 }}
      >
        <CustomChartWrapper>
          <Typography variant="h6">Composite Chart</Typography>
          <ChartsSurface>
            <BarPlot />
            <LinePlot />
            <MarkPlot />
            <ChartsXAxis axisId="x-axis-id" />
            <ChartsYAxis />
          </ChartsSurface>
          <ChartsLegend direction="horizontal" />
        </CustomChartWrapper>
      </ChartDataProviderPro>
    </Stack>
  );
}
