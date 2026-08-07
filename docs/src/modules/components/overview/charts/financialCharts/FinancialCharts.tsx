import * as React from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { type ZoomData } from '@mui/x-charts-premium/models';
import sp500 from 'docs/data/charts/dataset/sp500-intraday.json';
import {
  Candlestick,
  CANDLESTICK_X_AXIS_ID,
  getCandlestickZoomData,
} from '../advancedCharts/CandlestickDemo';
import { overviewSemanticColors } from '../theme/colors';

const compactCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});

const percentFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
  signDisplay: 'always',
  style: 'percent',
});

const latestPrice = sp500[sp500.length - 1];
const priceChange = latestPrice.close - latestPrice.open;
const priceChangePercent = priceChange / latestPrice.open;
const xData = sp500.map((entry) => new Date(Date.parse(entry.date)));
const closeData = sp500.map((entry) => entry.close);
const previewWidth = 1000;
const previewHeight = 56;
const previewTopPadding = 8;
const previewBottomPadding = 8;
const minZoomSpan = 1;

const previewDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
}).format;

const timeframes = [
  { label: '1W', value: '1W', days: 7 },
  { label: '1M', value: '1M', days: 31 },
  { label: '3M', value: '3M', days: 31 * 3 },
  { label: '1Y', value: '1Y', days: 365 },
] as const;

type Timeframe = (typeof timeframes)[number]['value'];

const defaultTimeframe = timeframes[1];

const marketStats = [
  { label: 'Open', value: latestPrice.open },
  { label: 'High', value: latestPrice.high },
  { label: 'Low', value: latestPrice.low },
  { label: 'Close', value: latestPrice.close },
];

function getPreviewPath(values: number[]) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const chartHeight = previewHeight - previewTopPadding - previewBottomPadding;
  const points = values.map((value, index) => {
    const x = values.length <= 1 ? 0 : (index / (values.length - 1)) * previewWidth;
    const y = previewTopPadding + (1 - (value - min) / range) * chartHeight;

    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });

  return {
    area: `M ${points.join(' L ')} L ${previewWidth},${previewHeight} L 0,${previewHeight} Z`,
    line: `M ${points.join(' L ')}`,
  };
}

const previewPath = getPreviewPath(closeData);

function clampZoomRange(start: number, end: number) {
  const safeStart = Math.min(100 - minZoomSpan, Math.max(0, start));
  const safeEnd = Math.max(safeStart + minZoomSpan, Math.min(100, end));

  return {
    start: Math.min(safeStart, safeEnd - minZoomSpan),
    end: safeEnd,
  };
}

function getZoomDate(percent: number) {
  const index = Math.min(
    xData.length - 1,
    Math.max(0, Math.round((percent / 100) * (xData.length - 1))),
  );

  return xData[index];
}

function PremiumBadge() {
  return (
    <Stack
      direction="row"
      spacing={0.75}
      sx={(theme) => ({
        alignItems: 'center',
        alignSelf: 'flex-start',
        border: '1px solid',
        borderColor: alpha(theme.palette.primary.main, 0.25),
        borderRadius: 1,
        color: 'primary.main',
        fontSize: theme.typography.pxToRem(12),
        fontWeight: 600,
        px: 1,
        py: 0.5,
        ...theme.applyDarkStyles({
          borderColor: alpha(theme.palette.primary.light, 0.3),
        }),
      })}
    >
      <img src="/static/x/premium.svg" width={16} height={16} alt="" />
      <span>Premium</span>
    </Stack>
  );
}

type ZoomPanPreviewProps = {
  onZoomChange: (zoomData: ZoomData[]) => void;
  zoomData: ZoomData[];
};

function ZoomPanPreview({ onZoomChange, zoomData }: ZoomPanPreviewProps) {
  const previewRef = React.useRef<HTMLDivElement>(null);
  const dragStateRef = React.useRef<{
    mode: 'pan' | 'resize-end' | 'resize-start';
    pointerId: number | null;
    start: number;
    end: number;
    pointerOffset: number;
  }>({
    mode: 'pan',
    pointerId: null,
    start: 0,
    end: 100,
    pointerOffset: 0,
  });
  const currentZoom = zoomData.find((item) => item.axisId === CANDLESTICK_X_AXIS_ID) ?? {
    axisId: CANDLESTICK_X_AXIS_ID,
    start: 0,
    end: 100,
  };
  const normalizedZoom = clampZoomRange(currentZoom.start, currentZoom.end);
  const zoomStart = normalizedZoom.start;
  const zoomEnd = normalizedZoom.end;
  const zoomWidth = zoomEnd - zoomStart;

  const getPointerPercent = (event: React.PointerEvent<HTMLDivElement>) => {
    const previewElement = previewRef.current ?? event.currentTarget;
    const { left, width } = previewElement.getBoundingClientRect();
    return Math.min(100, Math.max(0, ((event.clientX - left) / width) * 100));
  };

  const setZoomRange = React.useCallback(
    (start: number, end: number) => {
      const nextZoom = clampZoomRange(start, end);

      onZoomChange([{ axisId: CANDLESTICK_X_AXIS_ID, ...nextZoom }]);
    },
    [onZoomChange],
  );

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const { mode, pointerId, start, end, pointerOffset } = dragStateRef.current;

    if (pointerId !== event.pointerId) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    const pointerPercent = getPointerPercent(event);

    if (mode === 'resize-start') {
      setZoomRange(pointerPercent, end);
      return;
    }

    if (mode === 'resize-end') {
      setZoomRange(start, pointerPercent);
      return;
    }

    const span = end - start;
    const nextStart = Math.min(100 - span, Math.max(0, pointerPercent - pointerOffset));

    setZoomRange(nextStart, nextStart + span);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    previewRef.current?.setPointerCapture(event.pointerId);
    const pointerPercent = getPointerPercent(event);
    const isInsideSelection = pointerPercent >= zoomStart && pointerPercent <= zoomEnd;
    const pointerOffset = isInsideSelection ? pointerPercent - zoomStart : zoomWidth / 2;
    const nextStart = isInsideSelection
      ? zoomStart
      : Math.min(100 - zoomWidth, Math.max(0, pointerPercent - pointerOffset));

    dragStateRef.current = {
      mode: 'pan',
      pointerId: event.pointerId,
      start: nextStart,
      end: nextStart + zoomWidth,
      pointerOffset,
    };
    setZoomRange(nextStart, nextStart + zoomWidth);
  };

  const handleResizePointerDown =
    (mode: 'resize-end' | 'resize-start') => (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      previewRef.current?.setPointerCapture(event.pointerId);
      dragStateRef.current = {
        mode,
        pointerId: event.pointerId,
        start: zoomStart,
        end: zoomEnd,
        pointerOffset: 0,
      };
    };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStateRef.current.pointerId !== event.pointerId) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    dragStateRef.current.pointerId = null;

    if (previewRef.current?.hasPointerCapture(event.pointerId)) {
      previewRef.current.releasePointerCapture(event.pointerId);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const span = zoomEnd - zoomStart;
    const step = event.shiftKey ? 5 : 1;

    if (event.key === 'Home') {
      event.preventDefault();
      setZoomRange(0, span);
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      setZoomRange(100 - span, 100);
      return;
    }

    if (event.key === 'PageDown' || event.key === 'PageUp') {
      event.preventDefault();
      const direction = event.key === 'PageUp' ? -1 : 1;
      const nextStart = Math.min(100 - span, Math.max(0, zoomStart + direction * span));
      setZoomRange(nextStart, nextStart + span);
      return;
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      const direction = event.key === 'ArrowLeft' ? -1 : 1;
      const nextStart = Math.min(100 - span, Math.max(0, zoomStart + direction * step));
      setZoomRange(nextStart, nextStart + span);
    }
  };

  return (
    <Box
      ref={previewRef}
      aria-label="Visible market range"
      aria-orientation="horizontal"
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={Math.round(zoomEnd)}
      aria-valuetext={`${previewDateFormatter(getZoomDate(zoomStart))} to ${previewDateFormatter(
        getZoomDate(zoomEnd),
      )}`}
      onKeyDown={handleKeyDown}
      onPointerCancel={handlePointerUp}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      role="slider"
      tabIndex={0}
      sx={(theme) => ({
        position: 'relative',
        height: 64,
        border: '1px solid',
        borderColor: alpha(theme.palette.primary.main, 0.16),
        borderRadius: 1,
        bgcolor: alpha(theme.palette.background.paper, 0.68),
        cursor: 'grab',
        overflow: 'hidden',
        touchAction: 'none',
        userSelect: 'none',
        '&:active': {
          cursor: 'grabbing',
        },
        ...theme.applyDarkStyles({
          borderColor: alpha(theme.palette.primary.light, 0.18),
          bgcolor: alpha(theme.palette.background.paper, 0.44),
        }),
      })}
    >
      <Box
        component="svg"
        preserveAspectRatio="none"
        viewBox={`0 0 ${previewWidth} ${previewHeight}`}
        sx={{
          display: 'block',
          height: '100%',
          width: '100%',
        }}
      >
        <Box
          component="path"
          d={previewPath.area}
          sx={(theme) => ({
            fill: alpha(theme.palette.primary.main, 0.1),
            ...theme.applyDarkStyles({
              fill: alpha(theme.palette.primary.light, 0.13),
            }),
          })}
        />
        <Box
          component="path"
          d={previewPath.line}
          fill="none"
          vectorEffect="non-scaling-stroke"
          sx={(theme) => ({
            stroke: alpha(theme.palette.primary.main, 0.72),
            strokeWidth: 1.5,
            ...theme.applyDarkStyles({
              stroke: alpha(theme.palette.primary.light, 0.76),
            }),
          })}
        />
      </Box>
      <Box
        sx={(theme) => ({
          position: 'absolute',
          inset: 0,
          right: `${100 - zoomStart}%`,
          bgcolor: alpha(theme.palette.background.paper, 0.58),
          pointerEvents: 'none',
          ...theme.applyDarkStyles({
            bgcolor: alpha(theme.palette.background.default, 0.5),
          }),
        })}
      />
      <Box
        sx={(theme) => ({
          position: 'absolute',
          inset: 0,
          left: `${zoomEnd}%`,
          bgcolor: alpha(theme.palette.background.paper, 0.58),
          pointerEvents: 'none',
          ...theme.applyDarkStyles({
            bgcolor: alpha(theme.palette.background.default, 0.5),
          }),
        })}
      />
      <Box
        sx={(theme) => ({
          position: 'absolute',
          top: 4,
          bottom: 4,
          left: `${zoomStart}%`,
          width: `${zoomWidth}%`,
          border: '1px solid',
          borderColor: alpha(theme.palette.primary.main, 0.72),
          borderRadius: 0.75,
          bgcolor: alpha(theme.palette.primary.main, 0.09),
          boxShadow: `0 0 0 1px ${alpha(theme.palette.background.paper, 0.72)} inset`,
          pointerEvents: 'none',
          ...theme.applyDarkStyles({
            borderColor: alpha(theme.palette.primary.light, 0.82),
            bgcolor: alpha(theme.palette.primary.light, 0.1),
            boxShadow: `0 0 0 1px ${alpha(theme.palette.background.default, 0.7)} inset`,
          }),
        })}
      />
      {(['resize-start', 'resize-end'] as const).map((mode) => {
        const isStartHandle = mode === 'resize-start';

        return (
          <Box
            key={mode}
            aria-hidden
            onPointerCancel={handlePointerUp}
            onPointerDown={handleResizePointerDown(mode)}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            sx={{
              position: 'absolute',
              top: 4,
              bottom: 4,
              left: `calc(${isStartHandle ? zoomStart : zoomEnd}% - 8px)`,
              width: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'ew-resize',
              touchAction: 'none',
            }}
          >
            <Box
              sx={(theme) => ({
                width: 4,
                height: 28,
                borderRadius: 1,
                bgcolor: alpha(theme.palette.primary.main, 0.72),
                boxShadow: `0 0 0 2px ${alpha(theme.palette.background.paper, 0.82)}`,
                ...theme.applyDarkStyles({
                  bgcolor: alpha(theme.palette.primary.light, 0.78),
                  boxShadow: `0 0 0 2px ${alpha(theme.palette.background.default, 0.78)}`,
                }),
              })}
            />
          </Box>
        );
      })}
    </Box>
  );
}

export default function FinancialCharts() {
  const [selectedTimeframe, setSelectedTimeframe] = React.useState<Timeframe | null>(
    defaultTimeframe.value,
  );
  const [zoomData, setZoomData] = React.useState<ZoomData[]>(() =>
    getCandlestickZoomData(defaultTimeframe.days),
  );

  const handleTimeframeChange = (
    _event: React.MouseEvent<HTMLElement>,
    value: Timeframe | null,
  ) => {
    if (value === null) {
      return;
    }

    const timeframe = timeframes.find((item) => item.value === value);

    if (timeframe === undefined) {
      return;
    }

    setSelectedTimeframe(value);
    setZoomData(getCandlestickZoomData(timeframe.days));
  };

  const handleZoomChange = React.useCallback((nextZoomData: ZoomData[]) => {
    setSelectedTimeframe(null);
    setZoomData(nextZoomData);
  }, []);

  return (
    <React.Fragment>
      <Divider />
      <Stack
        spacing={3}
        sx={{
          py: 8,
          maxWidth: 1200,
          mx: 'auto',
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'flex-end' } }}
        >
          <Stack spacing={1}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
              <PremiumBadge />
              <Typography
                variant="overline"
                sx={(theme) => ({
                  color: (theme.vars || theme).palette.primary.main,
                })}
              >
                Financial Charts
              </Typography>
            </Stack>
            <Typography variant="h2" sx={{ fontSize: { xs: '1.75rem', md: '2rem' } }}>
              High-performance candlestick
            </Typography>
          </Stack>

          <Button
            size="small"
            href="/x/react-charts/candlestick/"
            endIcon={<ArrowForwardIcon />}
            sx={{ alignSelf: 'flex-start', whiteSpace: 'nowrap', width: 'fit-content' }}
          >
            Explore candlestick charts
          </Button>
        </Stack>

        <Paper
          variant="outlined"
          sx={(theme) => ({
            width: '100%',
            minWidth: 0,
            p: { xs: 2, md: 2.5 },
            borderColor: alpha(theme.palette.primary.main, 0.18),
            background: (theme.vars || theme).palette.gradients.linearSubtle,
            boxShadow: `0 24px 80px ${alpha(theme.palette.primary.main, 0.08)}`,
            ...theme.applyDarkStyles({
              borderColor: alpha(theme.palette.primary.light, 0.18),
              boxShadow: `0 24px 80px ${alpha('#000', 0.24)}`,
            }),
          })}
        >
          <Stack spacing={2.5}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
              }}
            >
              <Stack spacing={0.5}>
                <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                  SPX / S&P 500
                </Typography>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'baseline' }}>
                  <Typography component="p" variant="h4" sx={{ fontWeight: 600 }}>
                    {compactCurrencyFormatter.format(latestPrice.close)}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={(theme) => ({
                      color:
                        priceChange >= 0
                          ? overviewSemanticColors.positive(theme.palette.mode)
                          : overviewSemanticColors.negative(theme.palette.mode),
                      fontWeight: 600,
                    })}
                  >
                    {compactCurrencyFormatter.format(priceChange)}{' '}
                    {percentFormatter.format(priceChangePercent)}
                  </Typography>
                </Stack>
              </Stack>

              <ToggleButtonGroup
                exclusive
                value={selectedTimeframe}
                onChange={handleTimeframeChange}
                size="small"
                sx={(theme) => ({
                  flexWrap: 'wrap',
                  gap: 0.75,
                  '& .MuiToggleButtonGroup-grouped': {
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    color: 'text.secondary',
                    fontSize: theme.typography.pxToRem(12),
                    fontWeight: 600,
                    lineHeight: 1,
                    px: 1,
                    py: 0.75,
                    textTransform: 'none',
                    '&.Mui-selected': {
                      borderColor: alpha(theme.palette.primary.main, 0.45),
                      color: 'primary.main',
                    },
                  },
                })}
              >
                {timeframes.map((timeframe) => (
                  <ToggleButton
                    key={timeframe.value}
                    value={timeframe.value}
                    sx={(theme) => ({
                      '&.Mui-selected:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.12),
                      },
                    })}
                  >
                    {timeframe.label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Stack>

            <Stack spacing={1}>
              <Box
                sx={{
                  height: { xs: 360, md: 520 },
                  minWidth: 0,
                }}
              >
                <Candlestick
                  onZoomChange={handleZoomChange}
                  showCaption={false}
                  showTitle={false}
                  zoomData={zoomData}
                />
              </Box>
              <ZoomPanPreview onZoomChange={handleZoomChange} zoomData={zoomData} />
            </Stack>

            <Stack
              direction="row"
              spacing={1}
              sx={{
                overflow: 'auto',
                pb: 0.5,
              }}
            >
              {marketStats.map((stat) => (
                <Box
                  key={stat.label}
                  sx={(theme) => ({
                    minWidth: 112,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    px: 1.5,
                    py: 1,
                    bgcolor: alpha(theme.palette.background.paper, 0.72),
                  })}
                >
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {stat.label}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {compactCurrencyFormatter.format(stat.value)}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    </React.Fragment>
  );
}
