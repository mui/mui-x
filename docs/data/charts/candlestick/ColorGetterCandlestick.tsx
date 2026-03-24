import { Unstable_CandlestickChart as CandlestickChart } from '@mui/x-charts-premium/CandlestickChart';
import { OHLCValueType } from '@mui/x-charts-premium/models';
import sp500 from '../dataset/sp500-intraday.json';

const xData = sp500.map((entry) => new Date(Date.parse(entry.date)));

const data: Array<OHLCValueType> = sp500.map((entry) => [
  entry.open,
  entry.high,
  entry.low,
  entry.close,
]);

const chartConfig = {
  xAxis: [{ data: xData, zoom: { minSpan: 1, filterMode: 'discard' } }],
  height: 400,
} as const;

export default function ColorGetterCandlestick() {
  return (
    // prettier-ignore
    <CandlestickChart
      series={[
        {
          data,
          colorGetter: ({ value }) => {
            if (!value) { return 'transparent'; }
            const [open, high, low, close] = value;
            const intensity = Math.min(high - low / 5, 1);
            const r = close < open ? Math.round(180 + 75 * intensity) : 100;
            const g = close >= open ? Math.round(140 + 115 * intensity) : 100;
            return `rgb(${r}, ${g}, ${100})`;
          },
        },
      ]}
      {...chartConfig}
    />
  );
}
