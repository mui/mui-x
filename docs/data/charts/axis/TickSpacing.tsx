import { BarChart } from '@mui/x-charts/BarChart';
import data from '../dataset/sp500-intraday.json';

const tickLabelDateFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
});

export default function TickSpacing() {
  return (
    <BarChart
      xAxis={[
        {
          data: data.map((d) => new Date(Date.parse(d.date))),
          valueFormatter: (v: Date) => tickLabelDateFormatter.format(v),
          tickSpacing: 50,
          tickPlacement: 'middle',
        },
      ]}
      series={[{ data: data.map((d) => d.close), label: 'Close' }]}
      height={300}
    />
  );
}
