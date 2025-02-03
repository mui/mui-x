// @ts-nocheck
import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

// prettier-ignore
<div>
  <BarChart slotProps={{ legend: { position: { vertical: 'middle', horizontal: 'left' } } }} />
  <BarChart slotProps={{ legend: { position: { vertical: 'top', horizontal: 'middle' } } }} />
  <BarChart slotProps={{ legend: { position: { vertical: 'bottom', horizontal: 'right' } } }} />
  <BarChart slotProps={{ legend: { position: { vertical: 'wrong', horizontal: 'wrong' } } }} />
</div>;
