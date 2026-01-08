import { BarChart } from '@mui/x-charts/BarChart';

export default function SimpleCharts() {
  return (
    <BarChart
      xAxis={[
        {
          id: 'barCategories',
          data: ['bar A', 'bar B', 'bar C'],
          height: 28,
        },
      ]}
      series={[
        {
          data: [2, 5, 3],
        },
      ]}
      height={300}
    />
  );
}
