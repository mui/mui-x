// @ts-nocheck
import { BarChart } from '@mui/x-charts/BarChart';

// prettier-ignore
<div>
  <BarChart slotProps={{ legend: { position: { vertical: 'middle' }, hidden: true } }} />
  <BarChart slotProps={{ legend: { position: { vertical: 'top' }, hidden: false  } }} />
  <BarChart slotProps={{ legend: { hidden: true } }} />
  <BarChart slotProps={{ legend: { hidden: true, ...other } }} />
  <BarChart slotProps={{ legend: {} }} />
  <BarChart slotProps={{ }} />
  <BarChart />
</div>;
