import { CandlestickChart } from '@mui/x-charts-premium/CandlestickChart';
import { OHLCValueType } from '@mui/x-charts-premium/models';
import sp500 from '../dataset/sp500-intraday.json';

const xData = sp500.map((entry) => new Date(Date.parse(entry.date)));

const data: Array<OHLCValueType> = sp500.map((entry) => [
  entry.open,
  entry.high,
  entry.low,
  entry.close,
]);

export default function BasicCandlestick() {
  return (
    <CandlestickChart
      xAxis={[{ data: xData, zoom: { minSpan: 1, filterMode: 'discard' } }]}
      series={[{ data }]}
      height={400}
    />
  );
}
