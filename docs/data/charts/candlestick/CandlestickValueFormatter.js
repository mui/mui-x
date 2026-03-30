import { Unstable_CandlestickChart as CandlestickChart } from '@mui/x-charts-premium/CandlestickChart';

import sp500 from '../dataset/sp500-intraday.json';

const xData = sp500.map((entry) => new Date(Date.parse(entry.date)));

const data = [...sp500]
  .reverse()
  .map((entry) => [entry.open, entry.high, entry.low, entry.close]);

const dollarFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

const chartSettings = {
  xAxis: [
    {
      data: xData,
      valueFormatter: (date) => dateFormatter.format(date),
      zoom: { minSpan: 1, filterMode: 'discard' },
    },
  ],
  series: [],
  height: 400,
};

export default function CandlestickValueFormatter() {
  return (
    // prettier-ignore
    <CandlestickChart
      {...chartSettings}
      series={[
      {
        data,
        valueFormatter: (value, { field }) => {
          if (value === null) {return '';}
          if (field === 'open') {return `⇒ ${dollarFormatter.format(value)}`;}
          if (field === 'close') {return `⇍ ${dollarFormatter.format(value)}`;}
          if (field === 'high') {return `⇗ ${dollarFormatter.format(value)}`;}
          if (field === 'low') {return `⇙ ${dollarFormatter.format(value)}`;}
          return dollarFormatter.format(value);
        }
      }]
      } />
  );
}
