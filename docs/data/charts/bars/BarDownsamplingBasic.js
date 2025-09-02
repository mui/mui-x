import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

// Generate large dataset with 5000 data points
const generateLargeDataset = (size) => {
  return Array.from({ length: size }, (_, i) => ({
    x: i,
    value: Math.sin(i / 50) * 100 + 50 + 200,
  }));
};

const largeDataset = generateLargeDataset(1000);
const xAxisData = largeDataset.map((item) => item.x);
const yAxisData = largeDataset.map((item) => item.value);

export default function BarDownsamplingBasic() {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <h3>Original Data (1000 points)</h3>
      <BarChart
        width={600}
        height={180}
        series={[
          {
            data: yAxisData,
            label: 'All 5000 points',
          },
        ]}
        xAxis={[{ data: xAxisData, scaleType: 'band' }]}
        margin={{ left: 60, right: 20, top: 20, bottom: 40 }}
      />
      <h3>Downsampled Data (Auto - 200 points)</h3>
      <BarChart
        width={600}
        height={180}
        series={[
          {
            data: yAxisData,
            label: 'Downsampled to ~200 points',
          },
        ]}
        xAxis={[{ data: xAxisData, scaleType: 'band' }]}
        downsample={true} // Enable automatic downsampling at chart level
        margin={{ left: 60, right: 20, top: 20, bottom: 40 }}
      />
    </div>
  );
}
