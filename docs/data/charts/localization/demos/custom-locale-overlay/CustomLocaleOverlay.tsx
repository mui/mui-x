import { BarChart } from '@mui/x-charts/BarChart';

export default function CustomLocaleOverlay() {
  return (
    // @focus-start @padding 2
    <BarChart
      loading
      localeText={{ loading: 'Data are coming 🧙‍♂️' }}
      series={[]}
      height={200}
      width={300}
      xAxis={[{ data: ['Q1', 'Q2', 'Q3', 'Q4'] }]}
    />
    // @focus-end
  );
}
