import * as React from 'react';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const data = {
  height: 300,
  series: [
    { label: 'Sales', data: [42, 58, 71, 65, 80] },
    { label: 'Returns', data: [4, 6, 9, 7, 11] },
  ],
  xAxis: [{ data: ['Jan', 'Feb', 'Mar', 'Apr', 'May'], scaleType: 'band' as const }],
};

export default function ExportChartHideOnExport() {
  return (
    <Stack sx={{ width: '100%' }}>
      <Typography
        data-hide-on-export
        variant="caption"
        sx={{ alignSelf: 'center', color: 'warning.main' }}
      >
        Internal preview — hidden on export
      </Typography>
      <BarChartPro
        {...data}
        showToolbar
        slotProps={{
          // Forward the attribute to an internal slot so the legend is also stripped from exports.
          legend: { 'data-hide-on-export': true } as any,
        }}
      />
    </Stack>
  );
}
