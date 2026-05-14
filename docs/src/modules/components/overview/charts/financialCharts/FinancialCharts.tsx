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
import sp500 from 'docs/data/charts/dataset/sp500-intraday.json';
import { Candlestick } from '../advancedCharts/CandlestickDemo';
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

const miniMapDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
}).format;

const latestPrice = sp500[sp500.length - 1];
const priceChange = latestPrice.close - latestPrice.open;
const priceChangePercent = priceChange / latestPrice.open;
const xData = sp500.map((entry) => new Date(Date.parse(entry.date)));
const closeData = sp500.map((entry) => entry.close);
const latestDataIndex = sp500.length - 1;
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const miniMapWidth = 1000;
const miniMapHeight = 56;
const miniMapTopPadding = 8;
const miniMapBottomPadding = 8;

const timeframes = [
  { label: '1W', value: '1W', days: 7 },
  { label: '1M', value: '1M', days: 31 },
  { label: '3M', value: '3M', days: 31 * 3 },
  { label: '1Y', value: '1Y', days: 365 },
] as const;

type Timeframe = (typeof timeframes)[number]['value'];

const defaultTimeframe = timeframes[1];
const minVisibleDays = timeframes[0].days;
const maxVisibleDays = timeframes[timeframes.length - 1].days;

const marketStats = [
  { label: 'Open', value: latestPrice.open },
  { label: 'High', value: latestPrice.high },
  { label: 'Low', value: latestPrice.low },
  { label: 'Close', value: latestPrice.close },
];

function getEarliestCompleteWindowEndIndex(visibleDays: number) {
  const minEndTime = xData[0].getTime() + visibleDays * MS_PER_DAY;
  const endIndex = xData.findIndex((date) => date.getTime() >= minEndTime);

  return endIndex === -1 ? latestDataIndex : endIndex;
}

function clampVisibleEndIndex(endIndex: number, visibleDays: number) {
  return Math.min(
    latestDataIndex,
    Math.max(getEarliestCompleteWindowEndIndex(visibleDays), endIndex),
  );
}

function getVisibleStartIndex(visibleDays: number, endIndex: number) {
  const safeEndIndex = clampVisibleEndIndex(endIndex, visibleDays);
  const endDate = xData[safeEndIndex];
  const startTime = endDate.getTime() - visibleDays * MS_PER_DAY;
  const startIndex = xData.findIndex((date) => date.getTime() >= startTime);

  return startIndex === -1 ? 0 : Math.max(startIndex, 0);
}

function getIndexPercent(index: number) {
  return latestDataIndex === 0 ? 0 : (index / latestDataIndex) * 100;
}

function getMiniMapPath(values: number[]) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const chartHeight = miniMapHeight - miniMapTopPadding - miniMapBottomPadding;
  const points = values.map((value, index) => {
    const x = latestDataIndex === 0 ? 0 : (index / latestDataIndex) * miniMapWidth;
    const y = miniMapTopPadding + (1 - (value - min) / range) * chartHeight;

    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });

  return {
    line: `M ${points.join(' L ')}`,
    area: `M ${points.join(' L ')} L ${miniMapWidth},${miniMapHeight} L 0,${miniMapHeight} Z`,
  };
}

const miniMapPath = getMiniMapPath(closeData);

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

type ViewportMiniMapProps = {
  onVisibleEndIndexChange: (endIndex: number) => void;
  onVisibleRangeChange: (startIndex: number, endIndex: number) => void;
  visibleEndIndex: number;
  visibleStartIndex: number;
};

function ViewportMiniMap({
  onVisibleEndIndexChange,
  onVisibleRangeChange,
  visibleEndIndex,
  visibleStartIndex,
}: ViewportMiniMapProps) {
  const miniMapRef = React.useRef<HTMLDivElement>(null);
  const dragStateRef = React.useRef<{
    endIndex: number;
    mode: 'pan' | 'resize-end' | 'resize-start';
    offsetIndex: number;
    pointerId: number | null;
    startIndex: number;
    visiblePointCount: number;
  }>({
    endIndex: 0,
    mode: 'pan',
    offsetIndex: 0,
    pointerId: null,
    startIndex: 0,
    visiblePointCount: 0,
  });
  const startPercent = getIndexPercent(visibleStartIndex);
  const endPercent = getIndexPercent(visibleEndIndex);

  const getPointerIndex = (event: React.PointerEvent<HTMLDivElement>) => {
    const miniMapElement = miniMapRef.current ?? event.currentTarget;
    const { left, width } = miniMapElement.getBoundingClientRect();
    const pointerRatio = Math.min(1, Math.max(0, (event.clientX - left) / width));

    return Math.round(pointerRatio * latestDataIndex);
  };

  const moveViewport = (event: React.PointerEvent<HTMLDivElement>) => {
    const { endIndex, mode, offsetIndex, pointerId, startIndex, visiblePointCount } =
      dragStateRef.current;

    if (pointerId !== event.pointerId) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    const pointerIndex = getPointerIndex(event);

    if (mode === 'resize-start') {
      onVisibleRangeChange(pointerIndex, endIndex);
      return;
    }

    if (mode === 'resize-end') {
      onVisibleRangeChange(startIndex, pointerIndex);
      return;
    }

    const nextStartIndex = pointerIndex - offsetIndex;

    onVisibleEndIndexChange(nextStartIndex + visiblePointCount - 1);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    const pointerIndex = getPointerIndex(event);
    const visiblePointCount = Math.max(1, visibleEndIndex - visibleStartIndex + 1);
    const isPointerInsideVisibleRange =
      pointerIndex >= visibleStartIndex && pointerIndex <= visibleEndIndex;

    dragStateRef.current = {
      endIndex: visibleEndIndex,
      mode: 'pan',
      offsetIndex: isPointerInsideVisibleRange
        ? pointerIndex - visibleStartIndex
        : Math.floor(visiblePointCount / 2),
      pointerId: event.pointerId,
      startIndex: visibleStartIndex,
      visiblePointCount,
    };
    moveViewport(event);
  };

  const handleResizePointerDown =
    (mode: 'resize-end' | 'resize-start') => (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      event.currentTarget.setPointerCapture(event.pointerId);
      dragStateRef.current = {
        endIndex: visibleEndIndex,
        mode,
        offsetIndex: 0,
        pointerId: event.pointerId,
        startIndex: visibleStartIndex,
        visiblePointCount: Math.max(1, visibleEndIndex - visibleStartIndex + 1),
      };
    };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStateRef.current.pointerId === event.pointerId) {
      event.preventDefault();
      event.stopPropagation();
      dragStateRef.current.pointerId = null;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const visiblePointCount = Math.max(1, visibleEndIndex - visibleStartIndex + 1);
    const keyEndIndexDelta: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      PageDown: visiblePointCount,
      PageUp: -visiblePointCount,
    };
    const endIndexDelta = keyEndIndexDelta[event.key];

    if (event.key === 'Home') {
      event.preventDefault();
      event.stopPropagation();
      onVisibleEndIndexChange(visiblePointCount - 1);
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      event.stopPropagation();
      onVisibleEndIndexChange(latestDataIndex);
      return;
    }

    if (endIndexDelta !== undefined) {
      event.preventDefault();
      event.stopPropagation();
      onVisibleEndIndexChange(visibleEndIndex + endIndexDelta);
    }
  };

  return (
    <Box
      ref={miniMapRef}
      aria-label="Visible market range"
      aria-orientation="horizontal"
      aria-valuemax={latestDataIndex}
      aria-valuemin={0}
      aria-valuenow={visibleEndIndex}
      aria-valuetext={`${miniMapDateFormatter(xData[visibleStartIndex])} to ${miniMapDateFormatter(
        xData[visibleEndIndex],
      )}`}
      onKeyDown={handleKeyDown}
      onPointerCancel={handlePointerUp}
      onPointerDown={handlePointerDown}
      onPointerMove={moveViewport}
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
        viewBox={`0 0 ${miniMapWidth} ${miniMapHeight}`}
        sx={{
          display: 'block',
          height: '100%',
          width: '100%',
        }}
      >
        <Box
          component="path"
          d={miniMapPath.area}
          sx={(theme) => ({
            fill: alpha(theme.palette.primary.main, 0.1),
            ...theme.applyDarkStyles({
              fill: alpha(theme.palette.primary.light, 0.13),
            }),
          })}
        />
        <Box
          component="path"
          d={miniMapPath.line}
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
          right: `${100 - startPercent}%`,
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
          left: `${endPercent}%`,
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
          left: `${startPercent}%`,
          width: `${Math.max(0, endPercent - startPercent)}%`,
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
            onPointerMove={moveViewport}
            onPointerUp={handlePointerUp}
            sx={{
              position: 'absolute',
              top: 4,
              bottom: 4,
              left: `calc(${isStartHandle ? startPercent : endPercent}% - 8px)`,
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
  const chartViewportRef = React.useRef<HTMLDivElement>(null);
  const [selectedTimeframe, setSelectedTimeframe] = React.useState<Timeframe | null>(
    defaultTimeframe.value,
  );
  const [visibleDays, setVisibleDays] = React.useState<number>(defaultTimeframe.days);
  const [visibleEndIndex, setVisibleEndIndex] = React.useState(latestDataIndex);
  const panStateRef = React.useRef<{
    pointerId: number | null;
    startEndIndex: number;
    startX: number;
    visiblePointCount: number;
    width: number;
  }>({
    pointerId: null,
    startEndIndex: latestDataIndex,
    startX: 0,
    visiblePointCount: 0,
    width: 1,
  });
  const clampedVisibleEndIndex = React.useMemo(
    () => clampVisibleEndIndex(visibleEndIndex, visibleDays),
    [visibleDays, visibleEndIndex],
  );
  const visibleStartIndex = React.useMemo(
    () => getVisibleStartIndex(visibleDays, clampedVisibleEndIndex),
    [visibleDays, clampedVisibleEndIndex],
  );
  const handleMiniMapVisibleEndIndexChange = React.useCallback(
    (endIndex: number) => {
      setSelectedTimeframe(null);
      setVisibleEndIndex(clampVisibleEndIndex(endIndex, visibleDays));
    },
    [visibleDays],
  );
  const handleMiniMapVisibleRangeChange = React.useCallback(
    (startIndex: number, endIndex: number) => {
      const safeStartIndex = Math.min(latestDataIndex, Math.max(0, Math.min(startIndex, endIndex)));
      const safeEndIndex = Math.min(latestDataIndex, Math.max(safeStartIndex, endIndex));
      const rangeInDays =
        (xData[safeEndIndex].getTime() - xData[safeStartIndex].getTime()) / MS_PER_DAY;
      const nextVisibleDays = Math.min(
        maxVisibleDays,
        Math.max(minVisibleDays, Math.round(rangeInDays)),
      );

      setSelectedTimeframe(null);
      setVisibleDays(nextVisibleDays);
      setVisibleEndIndex(clampVisibleEndIndex(safeEndIndex, nextVisibleDays));
    },
    [],
  );

  React.useEffect(() => {
    setVisibleEndIndex((currentEndIndex) => clampVisibleEndIndex(currentEndIndex, visibleDays));
  }, [visibleDays]);

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
    setVisibleDays(timeframe.days);
    setVisibleEndIndex(latestDataIndex);
  };

  const handleChartWheel = React.useCallback(
    (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setSelectedTimeframe(null);

      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        const dataDelta =
          Math.sign(event.deltaX) * Math.max(1, Math.round(Math.abs(event.deltaX) / 24));

        setVisibleEndIndex((currentEndIndex) =>
          clampVisibleEndIndex(currentEndIndex + dataDelta, visibleDays),
        );
        return;
      }

      setVisibleDays((currentVisibleDays) => {
        const zoomFactor = event.deltaY > 0 ? 1.2 : 1 / 1.2;
        const nextVisibleDays = Math.round(currentVisibleDays * zoomFactor);

        return Math.min(maxVisibleDays, Math.max(minVisibleDays, nextVisibleDays));
      });
    },
    [visibleDays],
  );

  React.useEffect(() => {
    const chartViewport = chartViewportRef.current;

    if (chartViewport === null) {
      return undefined;
    }

    chartViewport.addEventListener('wheel', handleChartWheel, {
      capture: true,
      passive: false,
    });

    return () => {
      chartViewport.removeEventListener('wheel', handleChartWheel, { capture: true });
    };
  }, [handleChartWheel]);

  const handleChartPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    panStateRef.current = {
      pointerId: event.pointerId,
      startEndIndex: clampedVisibleEndIndex,
      startX: event.clientX,
      visiblePointCount: Math.max(1, clampedVisibleEndIndex - visibleStartIndex + 1),
      width: Math.max(1, event.currentTarget.clientWidth),
    };
  };

  const handleChartPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const panState = panStateRef.current;

    if (panState.pointerId !== event.pointerId) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    const deltaX = event.clientX - panState.startX;
    const dataDelta = Math.round((deltaX / panState.width) * panState.visiblePointCount);

    if (dataDelta === 0) {
      return;
    }

    setSelectedTimeframe(null);
    setVisibleEndIndex(clampVisibleEndIndex(panState.startEndIndex - dataDelta, visibleDays));
  };

  const handleChartPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (panStateRef.current.pointerId === event.pointerId) {
      event.preventDefault();
      event.stopPropagation();
      panStateRef.current.pointerId = null;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    }
  };

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
              High-performance candlestick and OHLC
            </Typography>
          </Stack>

          <Button
            href="/x/react-charts/candlestick/"
            endIcon={<ArrowForwardIcon />}
            sx={{ alignSelf: 'flex-start' }}
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
                ref={chartViewportRef}
                onPointerCancel={handleChartPointerUp}
                onPointerDown={handleChartPointerDown}
                onPointerLeave={handleChartPointerUp}
                onPointerMove={handleChartPointerMove}
                onPointerUp={handleChartPointerUp}
                sx={{
                  cursor: 'grab',
                  height: { xs: 360, md: 520 },
                  minWidth: 0,
                  touchAction: 'none',
                  '&:active': {
                    cursor: 'grabbing',
                  },
                }}
              >
                <Candlestick
                  showCaption={false}
                  showTitle={false}
                  visibleDays={visibleDays}
                  visibleEndIndex={clampedVisibleEndIndex}
                />
              </Box>

              <ViewportMiniMap
                onVisibleEndIndexChange={handleMiniMapVisibleEndIndexChange}
                onVisibleRangeChange={handleMiniMapVisibleRangeChange}
                visibleEndIndex={clampedVisibleEndIndex}
                visibleStartIndex={visibleStartIndex}
              />
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
