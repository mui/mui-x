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
          data: data.map((d) => new Date(d.date)),
          valueFormatter: (v) => tickLabelDateFormatter.format(v),
          zoom: true,
          ordinalTimeTicks: [
            'years',
            'quarterly',
            'months',
            'biweekly',
            'weeks',
            'days',
          ],
        },
      ]}
      series={[
        {
          data: data.map((d) => d.close),
          label: 'Close',
          highlightScope: { highlight: 'item', fade: 'global' },
        },
        {
          data: data.map((d) => d.open),
          label: 'Open',
          highlightScope: { highlight: 'item', fade: 'global' },
        },
      ]}
      height={300}
      renderer="svg-batch"
    />
  );
}
