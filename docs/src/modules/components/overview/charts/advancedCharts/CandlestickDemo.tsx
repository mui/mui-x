import useId from '@mui/utils/useId';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { ChartsAxisHighlight } from '@mui/x-charts-premium/ChartsAxisHighlight';
import { ChartsClipPath } from '@mui/x-charts-premium/ChartsClipPath';
import { ChartsDataProviderPremium } from '@mui/x-charts-premium/ChartsDataProviderPremium';
import { ChartsGrid } from '@mui/x-charts-premium/ChartsGrid';
import { ChartsLayerContainer } from '@mui/x-charts-premium/ChartsLayerContainer';
import { ChartsSvgLayer } from '@mui/x-charts-premium/ChartsSvgLayer';
import { ChartsTooltip } from '@mui/x-charts-premium/ChartsTooltip';
import { ChartsWebGLLayer } from '@mui/x-charts-premium/ChartsWebGLLayer';
import { ChartsWrapper } from '@mui/x-charts-premium/ChartsWrapper';
import { ChartsXAxis } from '@mui/x-charts-premium/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts-premium/ChartsYAxis';
import {
  ChartsZoomSlider,
  chartsAxisZoomSliderThumbClasses,
  chartsAxisZoomSliderTrackClasses,
} from '@mui/x-charts-premium/ChartsZoomSlider';
import { Unstable_CandlestickPlot as CandlestickPlot } from '@mui/x-charts-premium/CandlestickChart';
import { type OHLCValueType, type ZoomData } from '@mui/x-charts-premium/models';
import sp500 from 'docs/data/charts/dataset/sp500-intraday.json';
import ChartDemoWrapper from '../ChartDemoWrapper';
import { overviewChartPalette, overviewSemanticColors } from '../theme/colors';

const MS_PER_DAY = 24 * 60 * 60 * 1000;
export const CANDLESTICK_X_AXIS_ID = 'candlestick-time';
const CANDLESTICK_Y_AXIS_ID = 'candlestick-price';
const CANDLESTICK_SERIES_ID = 'sp500-ohlc';

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

export function getCandlestickZoomData(durationInDays: number): ZoomData[] {
  const latestDate = xData.at(-1)!;
  const startTime = latestDate.getTime() - durationInDays * MS_PER_DAY;
  const visibleStartIndex = xData.findIndex((date) => date.getTime() >= startTime);
  const startIndex = visibleStartIndex === -1 ? 0 : Math.max(visibleStartIndex, 0);

  return [
    {
      axisId: CANDLESTICK_X_AXIS_ID,
      start: (startIndex / xData.length) * 100,
      end: 100,
    },
  ];
}

type CandlestickProps = {
  onZoomChange?: (zoomData: ZoomData[]) => void;
  showCaption?: boolean;
  showTitle?: boolean;
  showZoomSlider?: boolean;
  zoomData?: ZoomData[];
};

export function Candlestick({
  onZoomChange,
  showCaption = true,
  showTitle = true,
  showZoomSlider = false,
  zoomData,
}: CandlestickProps) {
  const id = useId();
  const clipPathId = `${id}-clip-path`;
  const initialZoom = getCandlestickZoomData(31);

  return (
    <Stack sx={{ height: '100%' }}>
      {showTitle && <Typography align="center">S&P 500 intraday price movement</Typography>}
      <div style={{ flexGrow: 1, minHeight: 0 }}>
        <ChartsDataProviderPremium
          colors={overviewChartPalette}
          initialZoom={zoomData === undefined ? initialZoom : undefined}
          margin={{ top: 8, right: 12, bottom: 0, left: 0 }}
          onZoomChange={onZoomChange}
          zoomInteractionConfig={{
            pan: ['drag', 'wheel'],
            zoom: ['wheel', 'pinch'],
          }}
          series={[
            {
              data,
              downColor: overviewSemanticColors.negative,
              id: CANDLESTICK_SERIES_ID,
              label: 'S&P 500',
              type: 'ohlc',
              upColor: overviewSemanticColors.positive,
              valueFormatter: priceFormatter,
              xAxisId: CANDLESTICK_X_AXIS_ID,
              yAxisId: CANDLESTICK_Y_AXIS_ID,
            },
          ]}
          xAxis={[
            {
              id: CANDLESTICK_X_AXIS_ID,
              data: xData,
              height: 30,
              ordinalTimeTicks: undefined,
              scaleType: 'band',
              tickLabelStyle: { fontSize: 12 },
              tickLabelPlacement: 'middle',
              tickPlacement: 'middle',
              tickSpacing: 100,
              valueFormatter: (value: Date, context) =>
                context.location === 'tick'
                  ? axisDateFormatter(value)
                  : tooltipDateFormatter(value),
              zoom: {
                filterMode: 'discard',
                minSpan: 1,
                panning: true,
                slider: {
                  enabled: showZoomSlider,
                  preview: { seriesIds: [CANDLESTICK_SERIES_ID] },
                  showTooltip: 'hover',
                },
              },
            },
          ]}
          yAxis={[
            {
              id: CANDLESTICK_Y_AXIS_ID,
              valueFormatter: axisPriceFormatter,
              width: 48,
            },
          ]}
          zoomData={zoomData}
        >
          <ChartsWrapper
            sx={(theme) => ({
              '& [data-charts-zoom-slider] > g > rect[mask]': {
                fill: alpha(theme.palette.primary.main, 0.045),
                rx: 10,
                ry: 10,
                stroke: alpha(theme.palette.primary.main, 0.18),
                strokeWidth: 1.25,
              },
              '& [data-charts-zoom-slider] path, & [data-charts-zoom-slider] line': {
                stroke: alpha(theme.palette.primary.main, 0.36),
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                strokeWidth: 1.75,
              },
              '& [data-charts-zoom-slider] > g > rect:not([mask])': {
                rx: 10,
                ry: 10,
              },
              [`& .${chartsAxisZoomSliderTrackClasses.active}`]: {
                fill: alpha(theme.palette.primary.main, 0.11),
                rx: 9,
                ry: 9,
                stroke: (theme.vars || theme).palette.primary.main,
                strokeWidth: 1.25,
                transform: 'scaleY(0.86)',
                transformBox: 'fill-box',
                transformOrigin: 'center',
              },
              [`& .${chartsAxisZoomSliderThumbClasses.root}.${chartsAxisZoomSliderThumbClasses.root}`]:
                {
                  fill: (theme.vars || theme).palette.primary.main,
                  height: 32,
                  rx: 3.5,
                  ry: 3.5,
                  stroke: (theme.vars || theme).palette.background.paper,
                  strokeWidth: 2,
                  filter: `drop-shadow(0 1px 2px ${alpha(theme.palette.primary.main, 0.22)})`,
                  transform: 'translateY(-6px)',
                },
              ...theme.applyDarkStyles({
                '& [data-charts-zoom-slider] > g > rect[mask]': {
                  fill: alpha(theme.palette.primary.light, 0.09),
                  stroke: alpha(theme.palette.primary.light, 0.24),
                },
                '& [data-charts-zoom-slider] path, & [data-charts-zoom-slider] line': {
                  stroke: alpha(theme.palette.primary.light, 0.46),
                },
                [`& .${chartsAxisZoomSliderTrackClasses.active}`]: {
                  fill: alpha(theme.palette.primary.light, 0.13),
                  stroke: (theme.vars || theme).palette.primary.light,
                },
                [`& .${chartsAxisZoomSliderThumbClasses.root}.${chartsAxisZoomSliderThumbClasses.root}`]:
                  {
                    fill: (theme.vars || theme).palette.primary.light,
                    stroke: (theme.vars || theme).palette.background.paper,
                    filter: `drop-shadow(0 1px 2px ${alpha(theme.palette.primary.light, 0.2)})`,
                  },
              }),
            })}
          >
            <ChartsLayerContainer>
              <ChartsSvgLayer>
                <ChartsGrid horizontal />
              </ChartsSvgLayer>
              <ChartsWebGLLayer>
                <CandlestickPlot />
              </ChartsWebGLLayer>
              <ChartsSvgLayer>
                <g clipPath={`url(#${clipPathId})`}>
                  <ChartsAxisHighlight x="line" y="line" />
                </g>
                <ChartsClipPath id={clipPathId} />
                <ChartsXAxis axisId={CANDLESTICK_X_AXIS_ID} />
                <ChartsYAxis axisId={CANDLESTICK_Y_AXIS_ID} />
                <ChartsZoomSlider />
              </ChartsSvgLayer>
            </ChartsLayerContainer>
            <ChartsTooltip disablePortal />
          </ChartsWrapper>
        </ChartsDataProviderPremium>
      </div>
      {showCaption && (
        <Typography variant="caption" sx={{ textAlign: 'end' }}>
          Financial OHLC sample data, latest {captionDateFormatter(xData.at(-1)!)}
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
