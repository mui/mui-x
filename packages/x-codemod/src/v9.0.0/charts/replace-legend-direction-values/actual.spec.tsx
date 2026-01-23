// @ts-nocheck
import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

// prettier-ignore
<div>
  <BarChart slotProps={{ legend: { direction: 'row' } }} />
  <BarChart slotProps={{ legend: { direction: 'column', position: { vertical: 'top', horizontal: 'middle' } } }} />
  <BarChart slotProps={{ legend: { direction: 'wrong' } }} />
</div>;
