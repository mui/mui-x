// @ts-nocheck
import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

// prettier-ignore
<div>
  <PieChart
    slotProps={{
      legend: { hidden: true }
    }} />
  <PieChart
    slotProps={{
      tooltip: { trigger: 'axis' },
      legend: { hidden: true }
    }} />
</div>;
