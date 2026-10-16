import { LineChart } from '@mui/x-charts/LineChart';

export default function AreaBaseline() {
  return (
    // @focus-start @padding 2
    <LineChart
      xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
      series={[
        {
          data: [2, -5.5, 2, -7.5, 1.5, 6],
          area: true,
          baseline: 'min',
        },
      ]}
      height={300}
    />
    // @focus-end
  );
}
