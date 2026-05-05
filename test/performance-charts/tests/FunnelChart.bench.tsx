import * as React from 'react';
import { benchmark } from '@mui/internal-benchmark';
import { FunnelChart } from '@mui/x-charts-pro/FunnelChart';

const dataLength = 10;
const series = [
  {
    data: Array.from({ length: dataLength }, (_, i) => ({ value: dataLength / (i + 1) })),
  },
];

benchmark('FunnelChart with big data amount', () => (
  <FunnelChart series={series} width={500} height={300} />
));
