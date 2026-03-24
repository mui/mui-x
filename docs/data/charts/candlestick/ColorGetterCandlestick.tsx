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
      series={[{
        data,
        colorGetter: ({ value }) => {
          if (!value) { return 'transparent'; }
          const [open, , , close] = value;
          const t = Math.min(Math.abs(close - open) / open / 0.02, 1);
          const lo = Math.round(200 - 150 * t);
          const hi = Math.round(220 - 40 * t);
          return close >= open ? `rgb(${lo},${hi},${lo})` : `rgb(${hi},${lo},${lo})`;
        },
      }]}
      {...chartConfig}
    />
  );
}
