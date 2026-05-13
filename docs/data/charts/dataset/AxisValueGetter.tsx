import { LineChart } from '@mui/x-charts/LineChart';

const dataset = [
  { date: '2025-01-15T10:30:00Z', value: 42 },
  { date: '2025-02-20T14:00:00Z', value: 55 },
  { date: '2025-03-10T08:45:00Z', value: 38 },
  { date: '2025-04-05T16:20:00Z', value: 67 },
  { date: '2025-05-18T11:00:00Z', value: 73 },
  { date: '2025-06-22T09:15:00Z', value: 89 },
];

export default function AxisValueGetter() {
  return (
    <LineChart
      dataset={dataset}
      xAxis={[
        {
          scaleType: 'time',
          valueGetter: (item) => new Date(item.date as string),
          valueFormatter: (value: Date) =>
            value.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        },
      ]}
      series={[{ dataKey: 'value', label: 'Readings' }]}
      height={300}
    />
  );
}
