import { CandlestickChart } from '@mui/x-charts-premium/CandlestickChart';

import sp500ohlcv from '../dataset/sp500-2025-ohlcv.json'; // Source: Yahoo Finance

const xData = sp500ohlcv.map((entry) => new Date(Date.parse(entry.date)));

const ohlcData = sp500ohlcv.map((entry) => [
  entry.open,
  entry.high,
  entry.low,
  entry.close,
]);

export default function CandlestickComposition() {
  return (
    <CandlestickChart
      xAxis={[{ data: xData, zoom: { minSpan: 1, filterMode: 'discard' } }]}
      series={[{ data: ohlcData }]}
      height={400}
    />
  );
}
