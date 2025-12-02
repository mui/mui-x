import { BarChart } from '@mui/x-charts/BarChart';

const dollarFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export default function BarLabel() {
  return (
    <BarChart
      xAxis={[{ data: ['group A', 'group B', 'group C'] }]}
      series={[
        { data: [4, 3, 5], barLabel: 'value' },
        {
          data: [1, 6, 3],
          barLabel: (item) => dollarFormatter.format(item.value!),
        },
        { data: [2, 5, 6] },
      ]}
      height={300}
      margin={{ left: 0 }}
      yAxis={[{ width: 30 }]}
    />
  );
}
