import { Unstable_CandlestickChart as CandlestickChart } from '@mui/x-charts-premium/CandlestickChart';

import sp500 from '../dataset/sp500-intraday.json';

const xData = sp500.map((entry) => new Date(Date.parse(entry.date)));

const data = [...sp500]
  .reverse()
  .map((entry) => [entry.open, entry.high, entry.low, entry.close]);

const dollarFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

const chartSettings = {
  series: [{ data }],
  height: 400,
};

export default function CustomizedCandlestick() {
  return (
    <CandlestickChart
      {...chartSettings}
      xAxis={[
        {
          data: xData,
          valueFormatter: (date) => dateFormatter.format(date),
          zoom: { minSpan: 1, filterMode: 'discard' },
        },
      ]}
      yAxis={[{ valueFormatter: (value) => dollarFormatter.format(value) }]}
    />
  );
}
