import * as React from 'react';
import { benchmark } from '@mui/internal-benchmark';
import { Gauge } from '@mui/x-charts/Gauge';

const gaugeCount = 100;

benchmark('Gauge grid of 100 instances', () => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(10, 1fr)',
      width: 1000,
      height: 600,
    }}
  >
    {Array.from({ length: gaugeCount }, (_, i) => (
      <Gauge key={i} value={(i * 7) % 100} width={100} height={60} skipAnimation />
    ))}
  </div>
));
