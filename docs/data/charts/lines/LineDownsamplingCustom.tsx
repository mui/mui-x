import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

// Generate stock price-like data
const generateStockData = (size) => {
  let price = 100;
  return Array.from({ length: size }, (_, i) => {
    const change = (Math.random() - 0.5) * 4;
    const trend = Math.sin(i / 500) * 0.5;
    price += change + trend;
    return Math.max(price, 10); // Prevent negative prices
  });
};

const stockData = generateStockData(5000);
const timeAxis = Array.from({ length: 5000 }, (_, i) => i);

// Custom downsampling: Preserve significant price movements
const significantMovementDownsample = (data, targetPoints) => {
  if (data.length <= targetPoints) {
    return [...data];
  }

  const result = [];
  const threshold = 2; // Minimum price change to be significant

  // Always include first point
  result.push(data[0]);
  let lastIncluded = data[0];

  // Add points with significant changes
  for (let i = 1; i < data.length - 1; i += 1) {
    const currentValue = data[i];
    const change = Math.abs(currentValue - lastIncluded);

    if (change > threshold || result.length < targetPoints / 2) {
      result.push(currentValue);
      lastIncluded = currentValue;
    }
  }

  // Always include last point
  result.push(data[data.length - 1]);

  // If we still have too many points, apply linear downsampling
  if (result.length > targetPoints) {
    const step = result.length / targetPoints;
    return Array.from(
      { length: targetPoints },
      (_, i) => result[Math.floor(i * step)],
    );
  }

  return result;
};

// Custom downsampling: Time-weighted importance (recent data more important)
const timeWeightedDownsample = (data, targetPoints) => {
  if (data.length <= targetPoints) {
    return [...data];
  }

  const result = [];
  const totalPoints = data.length;

  for (let i = 0; i < targetPoints; i += 1) {
    // Exponential weighting favoring recent data
    const weight = Math.pow(i / (targetPoints - 1), 1.5);
    const index = Math.floor(weight * (totalPoints - 1));
    if (!result.includes(data[index])) {
      result.push(data[index]);
    }
  }

  return result;
};

export default function LineDownsamplingCustom() {
  return (
    <div style={{ width: '100%' }}>
      <h3>Original Stock Price Data (5000 points)</h3>
      <LineChart
        width={900}
        height={200}
        series={[
          {
            data: stockData,
            label: 'All price data',
            color: '#8884d8',
          },
        ]}
        xAxis={[{ data: timeAxis, label: 'Time' }]}
        yAxis={[{ label: 'Price ($)' }]}
        margin={{ left: 60, right: 20, top: 20, bottom: 60 }}
      />

      <h3>Custom: Significant Movement Preservation</h3>
      <LineChart
        width={900}
        height={200}
        series={[
          {
            data: stockData,
            label: 'Significant movements only',
            color: '#82ca9d',
          },
        ]}
        xAxis={[{ data: timeAxis, label: 'Time' }]}
        yAxis={[{ label: 'Price ($)' }]}
        downsample={significantMovementDownsample}
        margin={{ left: 60, right: 20, top: 20, bottom: 60 }}
      />

      <h3>Custom: Time-Weighted Importance</h3>
      <LineChart
        width={900}
        height={200}
        series={[
          {
            data: stockData,
            label: 'Recent data weighted',
            color: '#ffc658',
          },
        ]}
        xAxis={[{ data: timeAxis, label: 'Time' }]}
        yAxis={[{ label: 'Price ($)' }]}
        downsample={timeWeightedDownsample}
        margin={{ left: 60, right: 20, top: 20, bottom: 60 }}
      />

      <h3>Comparison: Built-in vs Custom Strategies</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <h4>Linear Strategy (Built-in)</h4>
          <LineChart
            width={900}
            height={180}
            series={[
              {
                data: stockData,
                label: 'Linear (built-in)',
                color: '#8884d8',
              },
            ]}
            xAxis={[{ data: timeAxis, label: 'Time' }]}
            yAxis={[{ label: 'Price ($)' }]}
            downsample={{ targetPoints: 500, strategy: 'linear' }}
            margin={{ left: 60, right: 20, top: 20, bottom: 60 }}
          />
        </div>
        <div>
          <h4>Peak Strategy (Built-in)</h4>
          <LineChart
            width={900}
            height={180}
            series={[
              {
                data: stockData,
                label: 'Peak (built-in)',
                color: '#82ca9d',
              },
            ]}
            xAxis={[{ data: timeAxis, label: 'Time' }]}
            yAxis={[{ label: 'Price ($)' }]}
            downsample={{ targetPoints: 500, strategy: 'peak' }}
            margin={{ left: 60, right: 20, top: 20, bottom: 60 }}
          />
        </div>
        <div>
          <h4>Custom Movement Detection</h4>
          <LineChart
            width={900}
            height={180}
            series={[
              {
                data: stockData,
                label: 'Custom movements',
                color: '#ff7c7c',
              },
            ]}
            xAxis={[{ data: timeAxis, label: 'Time' }]}
            yAxis={[{ label: 'Price ($)' }]}
            downsample={significantMovementDownsample}
            margin={{ left: 60, right: 20, top: 20, bottom: 60 }}
          />
        </div>
      </div>
    </div>
  );
}
