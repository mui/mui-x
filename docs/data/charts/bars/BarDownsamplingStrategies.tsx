import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

// Generate dataset with varying patterns to showcase different strategies
const generateDataWithPattern = (size: number) => {
  return Array.from({ length: size }, (_, i) => {
    const baseValue = Math.sin(i / 50) * 50 + 100;
    const spike = i % 30 === 0 ? 50 : 0;
    const noise = i % 4 === 0 ? 10 : -10;
    const valley = i % 20 === 0 ? -50 : 0;
    return baseValue + spike + noise + valley;
  });
};

const data = generateDataWithPattern(300);
const xAxisData = Array.from({ length: 300 }, (_, i) => i);
const config = {
  height: 200,
  series: [{ data }],
  xAxis: [{ data: xAxisData, scaleType: 'band' }],
} as const;

export default function BarDownsamplingStrategies() {
  return (
    <div style={{ width: '100%' }}>
      <h3>Original</h3>
      <BarChart {...config} />

      <h3>Linear Strategy (Default)</h3>
      <BarChart {...config} downsample={{ targetPoints: 100, strategy: 'linear' }} />

      <h3>Max Strategy (Preserves Peaks)</h3>
      <BarChart {...config} downsample={{ targetPoints: 100, strategy: 'max' }} />

      <h3>Min Strategy (Preserves Valleys)</h3>
      <BarChart {...config} downsample={{ targetPoints: 50, strategy: 'min' }} />

      <h3>Average Strategy (Smooths Data)</h3>
      <BarChart
        {...config}
        downsample={{ targetPoints: 100, strategy: 'average' }}
      />

      <h3>Peak Strategy (Preserves Important Variations)</h3>
      <BarChart {...config} downsample={{ targetPoints: 100, strategy: 'peak' }} />
    </div>
  );
}
