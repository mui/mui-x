import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

// Generate large dataset with 8000 data points simulating sensor data
const generateSensorData = (size: number): number[] => {
  return Array.from({ length: size }, (_, i) => {
    const time = i / 100; // Time scale
    const signal = Math.sin(time) * 50 + Math.cos(time * 3) * 20;
    const noise = (Math.random() - 0.5) * 10;
    return signal + noise + 100;
  });
};

const sensorData = generateSensorData(8000);
const timeAxis = Array.from({ length: 8000 }, (_, i) => i / 100);

export default function LineDownsamplingBasic() {
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <h3>Original Data (8000 points)</h3>
      <LineChart
        width={800}
        height={200}
        series={[
          {
            data: sensorData,
            label: 'All 8000 sensor readings',
            color: '#8884d8',
          },
        ]}
        xAxis={[{ data: timeAxis, label: 'Time (s)' }]}
        margin={{ left: 60, right: 20, top: 20, bottom: 60 }}
      />

      <h3>Downsampled Data (Auto - 1000 points)</h3>
      <LineChart
        width={800}
        height={200}
        series={[
          {
            data: sensorData,
            label: 'Downsampled to ~1000 points',
            color: '#82ca9d',
          },
        ]}
        xAxis={[{ data: timeAxis, label: 'Time (s)' }]}
        downsample={true} // Enable automatic downsampling at chart level
        margin={{ left: 60, right: 20, top: 20, bottom: 60 }}
      />
    </div>
  );
}
