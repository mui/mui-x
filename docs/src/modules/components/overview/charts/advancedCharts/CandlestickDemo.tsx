import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Unstable_CandlestickChart as CandlestickChart } from '@mui/x-charts-premium/CandlestickChart';
import { OHLCValueType } from '@mui/x-charts-premium/models';
import sp500 from 'docs/data/charts/dataset/sp500-intraday.json';
import ChartDemoWrapper from '../ChartDemoWrapper';
import { overviewChartPalette, overviewSemanticColors } from '../theme/colors';

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const CANDLESTICK_X_AXIS_ID = 'candlestick-time';

const xData = sp500.map((entry) => new Date(Date.parse(entry.date)));

const data: Array<OHLCValueType> = sp500.map((entry) => [
  entry.open,
  entry.high,
  entry.low,
  entry.close,
]);

const tooltipDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
}).format;

const axisDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
}).format;

const captionDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
}).format;

const priceFormatter = (value: number | null) =>
  value === null ? null : `$${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;

const axisPriceFormatter = (value: number | null) => priceFormatter(value) ?? '';

function getEarliestCompleteWindowEndIndex(durationInDays: number) {
  const minEndTime = xData[0].getTime() + durationInDays * MS_PER_DAY;
  const endIndex = xData.findIndex((date) => date.getTime() >= minEndTime);

  return endIndex === -1 ? xData.length - 1 : endIndex;
}

function getCandlestickData(durationInDays: number, endIndex: number) {
  const safeEndIndex = Math.min(
    Math.max(endIndex, getEarliestCompleteWindowEndIndex(durationInDays)),
    xData.length - 1,
  );
  const latestDate = xData[safeEndIndex];
  const startTime = latestDate.getTime() - durationInDays * MS_PER_DAY;
  const visibleStartIndex = xData.findIndex((date) => date.getTime() >= startTime);
  const startIndex = visibleStartIndex === -1 ? 0 : Math.max(visibleStartIndex, 0);

  return {
    xData: xData.slice(startIndex, safeEndIndex + 1),
    data: data.slice(startIndex, safeEndIndex + 1),
  };
}

function getCandlestickAxisTicks(dates: Date[]) {
  if (dates.length <= 10) {
    return dates;
  }

  const targetTickCount = 5;
  const step = Math.max(1, Math.floor((dates.length - 1) / (targetTickCount - 1)));
  const ticks = dates.filter((_date, index) => index % step === 0);
  const lastDate = dates.at(-1)!;

  if (ticks.at(-1) !== lastDate) {
    ticks.push(lastDate);
  }

  return ticks;
}

type CandlestickProps = {
  visibleEndIndex?: number;
  showCaption?: boolean;
  showTitle?: boolean;
  visibleDays?: number;
};

export function Candlestick({
  visibleEndIndex = xData.length - 1,
  showCaption = true,
  showTitle = true,
  visibleDays = 31,
}: CandlestickProps) {
  const visibleData = getCandlestickData(visibleDays, visibleEndIndex);
  const axisTicks = getCandlestickAxisTicks(visibleData.xData);

  return (
    <Stack sx={{ height: '100%' }}>
      {showTitle && <Typography align="center">S&P 500 intraday price movement</Typography>}
      <div style={{ flexGrow: 1, minHeight: 0 }}>
        <CandlestickChart
          colors={overviewChartPalette}
          xAxis={[
            {
              id: CANDLESTICK_X_AXIS_ID,
              data: visibleData.xData,
              height: 40,
              ordinalTimeTicks: undefined,
              scaleType: 'band',
              tickInterval: axisTicks,
              tickLabelPlacement: 'middle',
              tickLabelStyle: { fontSize: 12 },
              tickPlacement: 'middle',
              valueFormatter: (value: Date, context) =>
                context.location === 'tick'
                  ? axisDateFormatter(value)
                  : tooltipDateFormatter(value),
            },
          ]}
          yAxis={[{ width: 48, valueFormatter: axisPriceFormatter }]}
          series={[
            {
              data: visibleData.data,
              label: 'S&P 500',
              valueFormatter: priceFormatter,
              upColor: overviewSemanticColors.positive,
              downColor: overviewSemanticColors.negative,
            },
          ]}
          grid={{ horizontal: true }}
          hideLegend
          margin={{ top: 8, right: 12, bottom: 22, left: 0 }}
          slotProps={{ tooltip: { disablePortal: true } }}
        />
      </div>
      {showCaption && (
        <Typography variant="caption" sx={{ textAlign: 'end' }}>
          Financial OHLC sample data, latest {captionDateFormatter(visibleData.xData.at(-1)!)}
        </Typography>
      )}
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
