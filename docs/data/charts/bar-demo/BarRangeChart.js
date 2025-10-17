import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';

const rawData = [
  ['2025-10-04T06:23:16Z', 26.7, 32.5],
  ['2025-10-05T06:23:16Z', 27.0, 30.4],
  ['2025-10-06T06:23:16Z', 27.3, 32.5],
  ['2025-10-07T06:23:16Z', 25.7, 32.4],
  ['2025-10-08T06:23:16Z', 27.0, 35.5],
  ['2025-10-09T06:23:16Z', 27.3, 32.4],
  ['2025-10-10T06:23:16Z', 26.7, 32.5],
  ['2025-10-11T06:23:16Z', 27.0, 32.4],
  ['2025-10-12T06:23:16Z', 27.3, 32.5],
  ['2025-10-13T06:23:16Z', 26.7, 34.4],
  ['2025-10-14T06:23:16Z', 27.0, 32.5],
  ['2025-10-15T06:23:16Z', 27.3, 33.4],
  ['2025-10-16T06:23:16Z', 26.7, 31.5],
  ['2025-10-17T06:23:16Z', 27.0, 32.4],
];

const chartData = rawData.map(([dateStr, minTemp, maxTemp]) => ({
  date: new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  }),
  minTemp,
  maxTemp,
  tempRange: maxTemp - minTemp,
}));

function CustomBarLabel(props) {
  const theme = useTheme();
  const { x, y, width, height, dataIndex, seriesId } = props;

  if (seriesId !== 'temp-range' || height < 30) {
    return null;
  }

  const chartItem = chartData[dataIndex];
  const maxTemp = chartItem.maxTemp.toFixed(1);
  const minTemp = chartItem.minTemp.toFixed(1);

  const centerX = x + width / 2;
  const topY = y - 12;
  const bottomY = y + height + 24;

  const textStyle = {
    fontSize: '12px',
    fill: theme.palette.text.primary,
    fontWeight: 500,
  };

  return (
    <g>
      <text
        x={centerX}
        y={topY}
        textAnchor="middle"
        dominantBaseline="central"
        style={textStyle}
      >
        {maxTemp}°
      </text>
      <text
        x={centerX}
        y={bottomY}
        textAnchor="middle"
        dominantBaseline="central"
        style={textStyle}
      >
        {minTemp}°
      </text>
    </g>
  );
}

export default function BarRangeChart() {
  return (
    <div style={{ width: '100%', height: 400 }}>
      <BarChart
        dataset={chartData}
        xAxis={[
          {
            scaleType: 'band',
            dataKey: 'date',
            label: 'Date',
            categoryGapRatio: 0.6,
          },
        ]}
        series={[
          {
            dataKey: 'minTemp',
            color: 'transparent',
            showInLegend: false,
            stack: 'total',
            valueFormatter: () => null,
          },
          {
            id: 'temp-range',
            dataKey: 'tempRange',
            label: 'Temperature Range (°C)',
            stack: 'total',
          },
        ]}
        yAxis={[
          {
            label: 'Temperature (°C)',
            min: 20,
            max: 40,
          },
        ]}
        height={400}
        margin={{ top: 40, right: 20, bottom: 50, left: 50 }}
        slots={{ barLabel: CustomBarLabel }}
        barLabel="value"
        sx={(theme) => ({
          '& .MuiBarElement-root': {
            outline: `4px solid ${theme.palette.background.paper}`,
            borderRadius: '4px',
          },
        })}
      />
    </div>
  );
}
