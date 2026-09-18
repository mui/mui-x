import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { BarChartPremium } from '@mui/x-charts-premium/BarChartPremium';

const settings = {
  height: 300,
  xAxis: [{ data: ['Q1', 'Q2', 'Q3', 'Q4'] }],
  series: [
    { label: 'Revenue', data: [42, 51, 48, 63] },
    { label: 'Costs', data: [30, 34, 33, 39] },
  ],
};

export default function ExportChartAsExcel() {
  return (
    <Stack sx={{ width: '100%' }}>
      <Typography sx={{ alignSelf: 'center', my: 1 }}>
        Open the export menu and pick Download as Excel
      </Typography>
      <BarChartPremium {...settings} showToolbar />
    </Stack>
  );
}
