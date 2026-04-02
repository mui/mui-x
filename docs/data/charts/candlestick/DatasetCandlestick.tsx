import { Unstable_CandlestickChart as CandlestickChart } from '@mui/x-charts-premium/CandlestickChart';
import GOOGL from '../dataset/GOOGL.json';

const dataset = GOOGL.map((entry) => ({
  ...entry,
  date: new Date(Date.parse(entry.date)),
}));

export default function DatasetCandlestick() {
  return (
    <CandlestickChart
      dataset={dataset}
      xAxis={[
        {
          dataKey: 'date',
          zoom: { minSpan: 1, filterMode: 'discard' },
        },
      ]}
      series={[
        {
          datasetKeys: { open: 'open', high: 'high', low: 'low', close: 'close' },
        },
      ]}
      height={400}
    />
  );
}
