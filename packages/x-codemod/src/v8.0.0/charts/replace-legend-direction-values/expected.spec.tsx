// @ts-nocheck
import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

// prettier-ignore
<div>
  <BarChart
    slotProps={{
      legend: {
        direction: "horizontal"
      }
    }} />
  <BarChart
    slotProps={{
      legend: {
        position: { vertical: 'top', horizontal: 'middle' },
        direction: "vertical"
      }
    }} />
  <BarChart
    slotProps={{
      legend: {
        direction: 'wrong'
      }
    }} />
</div>;
