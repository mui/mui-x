import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';
import data from '../dataset/sp500-intraday.json';

const tickLabelDateFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
});

export default function BarBatchRenderer() {
  return (
    <BarChartPro
      xAxis={[
        {
          data: data.map((d) => new Date(Date.parse(d.date))),
          valueFormatter: (v: Date) => tickLabelDateFormatter.format(v),
          zoom: true,
        },
      ]}
      series={[
        {
          data: data.map((d) => d.close),
          label: 'Close',
        },
        { data: data.map((d) => d.open), label: 'Open' },
      ]}
      height={300}
      renderer="svg-batch"
      onItemClick={console.log}
    />
  );
}
