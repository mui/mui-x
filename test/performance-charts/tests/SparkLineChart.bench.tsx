import * as React from 'react';
import { benchmark } from '@mui/internal-benchmark';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';

const sparklineCount = 100;
const dataLength = 50;

const data = Array.from({ length: dataLength }, (_, i) => 50 + Math.sin(i / 5) * 25);

benchmark('SparkLineChart grid of 100 instances', () => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(10, 1fr)',
      width: 1000,
      height: 600,
    }}
  >
    {Array.from({ length: sparklineCount }, (_, i) => (
      <SparkLineChart key={i} data={data} width={100} height={60} skipAnimation />
    ))}
  </div>
));
