import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

// Generate time series data
const generateTimeSeriesData = (size) => {
  const baseTime = new Date('2023-01-01').getTime();
  return Array.from({ length: size }, (_, i) => ({
    timestamp: new Date(baseTime + i * 86400000), // Daily data
    value: Math.sin(i / 30) * 50 * 30 + 100,
  }));
};

const timeSeriesData = generateTimeSeriesData(1000);

// Custom downsampling function that prioritizes recent data
const customDownsample = (data, targetPoints) => {
  if (data.length <= targetPoints) {
    return [...data];
  }

  const result = [];
  const totalPoints = data.length;

  // Take more recent points (higher weight for later indices)
  for (let i = 0; i < targetPoints; i += 1) {
    // Weighted selection favoring more recent data
    const weight = Math.pow(i / (targetPoints - 1), 2);
    const index = Math.floor(weight * (totalPoints - 1));
    result.push(data[index]);
  }

  // Sort by original index to maintain order
  return result.sort((a, b) => data.indexOf(a) - data.indexOf(b));
};

// Another custom function: keep every Nth point with some randomness
const everyNth = (data, targetPoints) => {
  if (data.length <= targetPoints) {
    return [...data];
  }

  const step = data.length / targetPoints;
  const result = [];

  for (let i = 0; i < targetPoints; i += 1) {
    const baseIndex = Math.floor(i * step);
    const randomOffset = Math.floor(step * 0.3);
    const index = Math.min(baseIndex + randomOffset, data.length - 1);
    result.push(data[index]);
  }

  return result;
};

const data = timeSeriesData.map((item) => item.value);
const xAxisData = timeSeriesData.map((_, i) => i);

export default function BarDownsamplingCustom() {
  return (
    <div style={{ width: '100%' }}>
      <h3>Original Data (1000 points)</h3>
      <BarChart
        width={800}
        height={200}
        series={[
          {
            data,
            label: 'All data points',
          },
        ]}
        xAxis={[{ data: xAxisData, scaleType: 'band' }]}
        margin={{ left: 60, right: 20, top: 20, bottom: 40 }}
      />
      <h3>Custom Downsampling: Recent Data Priority</h3>
      <BarChart
        width={800}
        height={200}
        series={[
          {
            data,
            label: 'Recent data weighted',
          },
        ]}
        xAxis={[{ data: xAxisData, scaleType: 'band' }]}
        downsample={customDownsample}
        margin={{ left: 60, right: 20, top: 20, bottom: 40 }}
      />
      <h3>Custom Downsampling: Randomized Selection</h3>
      <BarChart
        width={800}
        height={200}
        series={[
          {
            data,
            label: 'Randomized sampling',
          },
        ]}
        xAxis={[{ data: xAxisData, scaleType: 'band' }]}
        downsample={everyNth}
        margin={{ left: 60, right: 20, top: 20, bottom: 40 }}
      />
    </div>
  );
}
