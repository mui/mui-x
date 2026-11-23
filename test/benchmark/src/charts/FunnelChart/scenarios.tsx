import * as React from 'react';
import { FunnelChart } from '@mui/x-charts-pro/FunnelChart';
import { defineScenario } from '../../utils/scenario';

const dataLength = 10;
const series = [
  {
    data: Array.from({ length: dataLength }, (_, i) => ({ value: dataLength / (i + 1) })),
  },
];

export const funnelChart = defineScenario('FunnelChart with big data amount', () => (
  <FunnelChart series={series} width={500} height={300} skipAnimation />
));
