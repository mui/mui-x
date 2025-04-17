// @ts-nocheck
// eslint-disable-next-line
import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

// prettier-ignore
<div>
  <BarChart
    slotProps={{ legend: {
      position: { vertical: 'middle' }
    } }}
    hideLegend={true} />
  <BarChart
    slotProps={{ legend: {
      position: { vertical: 'top' }
    } }}
    hideLegend={false} />
  <BarChart slotProps={{ legend: {} }} />
  <BarChart slotProps={{ }} />
  <BarChart />
</div>;
