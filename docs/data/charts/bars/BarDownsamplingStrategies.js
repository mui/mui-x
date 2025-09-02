import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

// Generate dataset with varying patterns to showcase different strategies
const generateDataWithPattern = (size) => {
  return Array.from({ length: size }, (_, i) => {
    const baseValue = Math.sin(i / 100) * 50 + 100;
    const spike = i % 200 === 0 ? 150 : 0; // Periodic spikes
    const noise = Math.random() * 20 - 10;
    return baseValue + spike + noise;
  });
};

const data = generateDataWithPattern(3000);
const xAxisData = Array.from({ length: 3000 }, (_, i) => i);

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
        downsample={{ targetPoints: 300, strategy: 'linear' }}
        margin={{ left: 60, right: 20, top: 20, bottom: 40 }}
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
        downsample={{ targetPoints: 300, strategy: 'max' }}
        margin={{ left: 60, right: 20, top: 20, bottom: 40 }}
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
        downsample={{ targetPoints: 300, strategy: 'average' }}
        margin={{ left: 60, right: 20, top: 20, bottom: 40 }}
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
        downsample={{ targetPoints: 300, strategy: 'peak' }}
        margin={{ left: 60, right: 20, top: 20, bottom: 40 }}
      />
    </div>
  );
}
