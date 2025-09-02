import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

// Generate dataset with varying patterns to showcase different strategies
const generateDataWithPattern = (size) => {
  return Array.from({ length: size }, (_, i) => {
    const baseValue = Math.sin(i / 100) * 50 + 60;
    const spike = i % 100 === 0 ? 50 : 0;
    const noise = i % 2 === 0 ? 10 : -10;
    return baseValue + spike + noise;
  });
};

const data = generateDataWithPattern(500);
const xAxisData = Array.from({ length: 500 }, (_, i) => i);

export default function BarDownsamplingStrategies() {
  return (
    <div style={{ width: '100%' }}>
      <h3>Linear Strategy (Default)</h3>
      <BarChart
        width={800}
        height={200}
        series={[
          {
            data,
            label: 'Linear downsampling',
          },
        ]}
        xAxis={[{ data: xAxisData, scaleType: 'band' }]}
        downsample={{ targetPoints: 50, strategy: 'linear' }}
      />
      <h3>Max Strategy (Preserves Peaks)</h3>
      <BarChart
        width={800}
        height={200}
        series={[
          {
            data,
            label: 'Max strategy',
          },
        ]}
        xAxis={[{ data: xAxisData, scaleType: 'band' }]}
        downsample={{ targetPoints: 50, strategy: 'max' }}
      />
      <h3>Average Strategy (Smooths Data)</h3>
      <BarChart
        width={800}
        height={200}
        series={[
          {
            data,
            label: 'Average strategy',
          },
        ]}
        xAxis={[{ data: xAxisData, scaleType: 'band' }]}
        downsample={{ targetPoints: 50, strategy: 'average' }}
      />
      <h3>Peak Strategy (Preserves Important Variations)</h3>
      <BarChart
        width={800}
        height={200}
        series={[
          {
            data,
            label: 'Peak strategy',
          },
        ]}
        xAxis={[{ data: xAxisData, scaleType: 'band' }]}
        downsample={{ targetPoints: 50, strategy: 'peak' }}
      />
    </div>
  );
}
