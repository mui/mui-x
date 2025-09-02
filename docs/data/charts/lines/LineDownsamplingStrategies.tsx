import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

// Generate complex signal data with various patterns
const generateComplexSignal = (size: number) => {
  return Array.from({ length: size }, (_, i) => {
    const t = i / 200;
    const mainSignal = Math.sin(t) * 80;
    const highFreq = Math.sin(t * 10) * 15;
    const spikes = i % 500 === 0 ? 100 : 0; // Periodic spikes
    const noise = (Math.random() - 0.5) * 8;
    return mainSignal + highFreq + spikes + noise + 150;
  });
};

const signalData = generateComplexSignal(4000);
const timeAxis = Array.from({ length: 4000 }, (_, i) => i / 200);

export default function LineDownsamplingStrategies() {
  return (
    <div style={{ width: '100%' }}>
      <h3>Linear Strategy (Default)</h3>
      <LineChart
        width={900}
        height={180}
        series={[
          {
            data: signalData,
            label: 'Linear downsampling',
            color: '#8884d8',
          },
        ]}
        xAxis={[{ data: timeAxis, label: 'Time (s)' }]}
        downsample={{ targetPoints: 400, strategy: 'linear' }}
        margin={{ left: 60, right: 20, top: 20, bottom: 50 }}
      />

      <h3>Peak Strategy (Preserves Important Variations)</h3>
      <LineChart
        width={900}
        height={180}
        series={[
          {
            data: signalData,
            label: 'Peak strategy',
            color: '#82ca9d',
          },
        ]}
        xAxis={[{ data: timeAxis, label: 'Time (s)' }]}
        downsample={{ targetPoints: 400, strategy: 'peak' }}
        margin={{ left: 60, right: 20, top: 20, bottom: 50 }}
      />

      <h3>Max Strategy (Preserves Signal Peaks)</h3>
      <LineChart
        width={900}
        height={180}
        series={[
          {
            data: signalData,
            label: 'Max strategy',
            color: '#ffc658',
          },
        ]}
        xAxis={[{ data: timeAxis, label: 'Time (s)' }]}
        downsample={{ targetPoints: 400, strategy: 'max' }}
        margin={{ left: 60, right: 20, top: 20, bottom: 50 }}
      />

      <h3>Average Strategy (Smooths Signal)</h3>
      <LineChart
        width={900}
        height={180}
        series={[
          {
            data: signalData,
            label: 'Average strategy',
            color: '#ff7c7c',
          },
        ]}
        xAxis={[{ data: timeAxis, label: 'Time (s)' }]}
        downsample={{ targetPoints: 400, strategy: 'average' }}
        margin={{ left: 60, right: 20, top: 20, bottom: 50 }}
      />

      <h3>Comparison: Different Target Points</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <h4>Peak Strategy - 300 points</h4>
          <LineChart
            width={900}
            height={160}
            series={[
              {
                data: signalData,
                label: 'Peak preserved (300 pts)',
                color: '#8884d8',
              },
            ]}
            xAxis={[{ data: timeAxis, label: 'Time (s)' }]}
            downsample={{ targetPoints: 300, strategy: 'peak' }}
            margin={{ left: 60, right: 20, top: 20, bottom: 50 }}
          />
        </div>
        <div>
          <h4>Average Strategy - 200 points</h4>
          <LineChart
            width={900}
            height={160}
            series={[
              {
                data: signalData,
                label: 'Smoothed (200 pts)',
                color: '#82ca9d',
              },
            ]}
            xAxis={[{ data: timeAxis, label: 'Time (s)' }]}
            downsample={{ targetPoints: 200, strategy: 'average' }}
            margin={{ left: 60, right: 20, top: 20, bottom: 50 }}
          />
        </div>
      </div>
    </div>
  );
}
