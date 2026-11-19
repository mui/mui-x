import { BarChart } from '@mui/x-charts/BarChart';

export default function LogScaleBars() {
  return (
    <BarChart
      xAxis={[{ data: ['A', 'B', 'C', 'D', 'E'] }]}
      yAxis={[{ scaleType: 'log' }]}
      series={[{ data: [0.0123, 0.5, 8, 150, 3200], baseline: 'min' }]}
      height={300}
    />
  );
}
