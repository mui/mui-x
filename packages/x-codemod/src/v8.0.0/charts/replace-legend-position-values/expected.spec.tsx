// @ts-nocheck
import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

// prettier-ignore
<div>
  <BarChart
    slotProps={{
      legend: {
        position: {
          vertical: 'middle',
          horizontal: "start"
        }
      }
    }} />
  <BarChart
    slotProps={{
      legend: {
        position: {
          vertical: 'top',
          horizontal: "center"
        }
      }
    }} />
  <BarChart
    slotProps={{
      legend: {
        position: {
          vertical: 'bottom',
          horizontal: "end"
        }
      }
    }} />
  <BarChart
    slotProps={{
      legend: {
        position: {
          vertical: 'wrong',
          horizontal: 'wrong'
        }
      }
    }} />
</div>;
