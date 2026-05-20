import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ChartsLegend } from '@mui/x-charts/ChartsLegend';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { Toolbar } from '@mui/x-charts/Toolbar';
import { useChartRootRef } from '@mui/x-charts/hooks';
import { ChartsDataProviderPro } from '@mui/x-charts-pro/ChartsDataProviderPro';
import {
  ChartsToolbarImageExportTrigger,
  ChartsToolbarPrintExportTrigger,
} from '@mui/x-charts-pro/ChartsToolbarPro';

function CustomWrapper({ children }) {
  const chartRootRef = useChartRootRef();
  return (
    <Stack ref={chartRootRef} sx={{ width: '100%' }}>
      {children}
    </Stack>
  );
}

export default function ExportChartHideOnExport() {
  return (
    <ChartsDataProviderPro
      height={300}
      series={[
        { type: 'bar', label: 'Sales', data: [42, 58, 71, 65, 80] },
        { type: 'bar', label: 'Returns', data: [4, 6, 9, 7, 11] },
      ]}
      xAxis={[
        {
          data: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
          scaleType: 'band',
          id: 'x-axis',
        },
      ]}
    >
      <CustomWrapper>
        <Toolbar>
          <ChartsToolbarPrintExportTrigger>Print</ChartsToolbarPrintExportTrigger>
          <ChartsToolbarImageExportTrigger>
            Export as image
          </ChartsToolbarImageExportTrigger>
        </Toolbar>
        <Typography
          data-hide-on-export
          variant="caption"
          sx={{ alignSelf: 'center', color: 'warning.main' }}
        >
          Internal preview — hidden on export
        </Typography>
        <ChartsSurface>
          <BarPlot />
          <ChartsXAxis axisId="x-axis" />
          <ChartsYAxis />
        </ChartsSurface>
        <ChartsLegend data-hide-on-export direction="horizontal" />
      </CustomWrapper>
    </ChartsDataProviderPro>
  );
}
