import * as React from 'react';
import { BarChart, type BarChartProps } from '@mui/x-charts/BarChart';

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

const length = 300;
const data = generateDataWithPattern(length);
const xAxisData = Array.from({ length }, (_, i) => i);
const config: BarChartProps = {
  height: 200,
  series: [{ data }],
  xAxis: [
    {
      data: xAxisData,
      scaleType: 'band',
      tickInterval: (v, index) => index % (700 / 50 + 1) === 0 || v === 299,
    },
  ],
};

export default function BarDownsamplingStrategies() {
  return (
    <div style={{ width: '100%' }}>
      <h3>Original</h3>
      <BarChart
        {...config}
        xAxis={[
          {
            ...config.xAxis![0],
            tickPlacement: 'middle',
            tickInterval: [
              ...Array.from({ length: length / 50 + 1 }, (_, i) => i * 50),
              length - 1,
            ],
          },
        ]}
      />

      <h3>Linear Strategy (Default)</h3>
      <BarChart {...config} downsample={{ targetPoints: 100, strategy: 'linear' }} />

      <h3>Max Strategy (Preserves Peaks)</h3>
      <BarChart {...config} downsample={{ targetPoints: 100, strategy: 'max' }} />

      <h3>Min Strategy (Preserves Valleys)</h3>
      <BarChart {...config} downsample={{ targetPoints: 100, strategy: 'min' }} />

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
