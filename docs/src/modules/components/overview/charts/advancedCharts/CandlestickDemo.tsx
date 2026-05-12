import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Unstable_CandlestickChart as CandlestickChart } from '@mui/x-charts-premium/CandlestickChart';
import { OHLCValueType } from '@mui/x-charts-premium/models';
import sp500 from 'docs/data/charts/dataset/sp500-intraday.json';
import ChartDemoWrapper from '../ChartDemoWrapper';
import { overviewChartPalette, overviewSemanticColors } from '../theme/colors';

const xData = sp500.map((entry) => new Date(Date.parse(entry.date)));

const data: Array<OHLCValueType> = sp500.map((entry) => [
  entry.open,
  entry.high,
  entry.low,
  entry.close,
]);

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
}).format;

const priceFormatter = (value: number | null) =>
  value === null ? null : `$${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;

const axisPriceFormatter = (value: number | null) => priceFormatter(value) ?? '';

function Candlestick() {
  return (
    <Stack sx={{ height: '100%' }}>
      <Typography align="center">S&P 500 intraday price movement</Typography>
      <div style={{ flexGrow: 1, minHeight: 0 }}>
        <CandlestickChart
          colors={overviewChartPalette}
          xAxis={[
            {
              data: xData,
              scaleType: 'band',
              valueFormatter: (value: Date) => dateFormatter(value),
            },
          ]}
          yAxis={[{ width: 48, valueFormatter: axisPriceFormatter }]}
          series={[
            {
              data,
              label: 'S&P 500',
              valueFormatter: priceFormatter,
              upColor: overviewSemanticColors.positive,
              downColor: overviewSemanticColors.negative,
            },
          ]}
          grid={{ horizontal: true }}
          hideLegend
          margin={{ top: 8, right: 12, bottom: 20, left: 0 }}
          slotProps={{ tooltip: { disablePortal: true } }}
        />
      </div>
      <Typography variant="caption" sx={{ textAlign: 'end' }}>
        Financial OHLC sample data
      </Typography>
    </Stack>
  );
}

export default function CandlestickDemo() {
  return (
    <ChartDemoWrapper link="/x/react-charts/candlestick/">
      <Candlestick />
    </ChartDemoWrapper>
  );
}
