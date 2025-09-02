import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

// Generate complex signal data with various patterns
const generateDataWithPattern = (size) => {
  return Array.from({ length: size }, (_, i) => {
    const baseValue = Math.sin(i / 100) * 50 + 100;
    const spike = i % 30 === 0 ? 50 : 0;
    const noise = i % 4 === 0 ? 10 : -10;
    const valley = i % 20 === 0 ? -50 : 0;
    return baseValue + spike + noise + valley;
  });
};

const signalData = generateDataWithPattern(900);
const timeAxis = Array.from(
  { length: 900 },
  (_, i) => new Date(2020, 0, 1, 0, 0, i),
);
const config = {
  height: 180,
  series: [
    {
      data: signalData,
      showMark: false,
      valueFormatter: (value) => (value ? `${value?.toFixed(2)}kJ` : 'N/A'),
      curve: 'natural',
    },
  ],
  xAxis: [
    {
      data: timeAxis,
      label: 'Time (s)',
      scaleType: 'time',
      valueFormatter: (value) => value.toLocaleTimeString(),
    },
  ],
};

export default function LineDownsamplingStrategies() {
  return (
    <div style={{ width: '100%' }}>
      <h3>Original</h3>
      <LineChart {...config} />
      <h3>Linear Strategy (Default)</h3>
      <LineChart {...config} downsample={{ targetPoints: 50, strategy: 'linear' }} />
      <h3>Max Strategy (Preserves Peaks)</h3>
      <LineChart {...config} downsample={{ targetPoints: 50, strategy: 'max' }} />
      <h3>Min Strategy (Preserves Valleys)</h3>
      <LineChart {...config} downsample={{ targetPoints: 50, strategy: 'min' }} />
      <h3>Average Strategy (Smooths Data)</h3>
      <LineChart
        {...config}
        downsample={{ targetPoints: 50, strategy: 'average' }}
      />
      <h3>Peak Strategy (Preserves Important Variations)</h3>
      <LineChart {...config} downsample={{ targetPoints: 50, strategy: 'peak' }} />
    </div>
  );
}
