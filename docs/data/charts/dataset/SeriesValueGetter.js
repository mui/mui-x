import { BarChart } from '@mui/x-charts/BarChart';

const dataset = [
  { product: 'Widget A', revenue: '1250.50', cost: '800.25' },
  { product: 'Widget B', revenue: '3200.00', cost: '1500.75' },
  { product: 'Widget C', revenue: '890.75', cost: '450.00' },
  { product: 'Widget D', revenue: '2100.30', cost: '1100.50' },
  { product: 'Widget E', revenue: '1750.00', cost: '900.00' },
];

const toNumber = (value) => (typeof value === 'string' ? parseFloat(value) : null);

export default function SeriesValueGetter() {
  return (
    <BarChart
      dataset={dataset}
      xAxis={[{ dataKey: 'product', scaleType: 'band' }]}
      series={[
        {
          dataKey: 'revenue',
          label: 'Revenue',
          valueGetter: toNumber,
          valueFormatter: (v) => (v == null ? '' : `$${v.toFixed(2)}`),
        },
        {
          dataKey: 'cost',
          label: 'Cost',
          valueGetter: toNumber,
          valueFormatter: (v) => (v == null ? '' : `$${v.toFixed(2)}`),
        },
      ]}
      yAxis={[{ label: 'Amount ($)', width: 60 }]}
      height={300}
    />
  );
}
