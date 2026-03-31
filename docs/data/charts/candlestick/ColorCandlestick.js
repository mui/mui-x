import { Unstable_CandlestickChart as CandlestickChart } from '@mui/x-charts-premium/CandlestickChart';

import sp500 from '../dataset/sp500-intraday.json';

const xData = sp500.map((entry) => new Date(Date.parse(entry.date)));

const data = sp500.map((entry) => [entry.open, entry.high, entry.low, entry.close]);

export default function ColorCandlestick() {
  return (
    <CandlestickChart
      xAxis={[{ data: xData, zoom: { minSpan: 1, filterMode: 'discard' } }]}
      series={[
        {
          data,
          upColor: '#7B2FBE',
          downColor: (mode) => (mode === 'dark' ? '#f7be85' : '#F28C28'),
        },
      ]}
      height={400}
    />
  );
}
