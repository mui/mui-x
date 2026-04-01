import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import useId from '@mui/utils/useId';
import { ChartsClipPath } from '@mui/x-charts-premium/ChartsClipPath';
import { Unstable_CandlestickPlot as CandlestickPlot } from '@mui/x-charts-premium/CandlestickChart';
import { LinePlot } from '@mui/x-charts-premium/LineChart';
import { BarPlot } from '@mui/x-charts-premium/BarChart';
import { ChartsXAxis } from '@mui/x-charts-premium/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts-premium/ChartsYAxis';
import { useAxesTooltip } from '@mui/x-charts-premium/ChartsTooltip';

import { ChartsDataProviderPremium } from '@mui/x-charts-premium/ChartsDataProviderPremium';
import { ChartsWrapper } from '@mui/x-charts-premium/ChartsWrapper';
import { ChartsAxisHighlight } from '@mui/x-charts-premium/ChartsAxisHighlight';
import { ChartsGrid } from '@mui/x-charts-premium/ChartsGrid';
import { useDrawingArea, useXScale } from '@mui/x-charts-premium/hooks';
import { ChartsWebGLLayer } from '@mui/x-charts-premium/ChartsWebGLLayer';
import { ChartsLayerContainer } from '@mui/x-charts-premium/ChartsLayerContainer';
import { ChartsSvgLayer } from '@mui/x-charts-premium/ChartsSvgLayer';
import { ChartsZoomSlider } from '@mui/x-charts-premium/ChartsZoomSlider';
import {
  ChartsToolbarImageExportTrigger,
  ChartsToolbarPrintExportTrigger,
} from '@mui/x-charts-premium/ChartsToolbarPro';
import { Toolbar, ToolbarButton } from '@mui/x-charts-premium/Toolbar';
import ohlcv from '../dataset/ibkr-2025-ohlcv.json'; // Source: Yahoo Finance

const dividends = [
  { date: '2025-02-28T00:00:00', amount: 0.0625 },
  { date: '2025-05-30T00:00:00', amount: 0.08 },
  { date: '2025-08-29T00:00:00', amount: 0.08 },
  { date: '2025-12-01T00:00:00', amount: 0.08 },
];

const stockSplits = [{ date: '2025-06-18T00:00:00', ratio: 4 }];

const xData = ohlcv.map((entry) => new Date(Date.parse(entry.date)));

const ohlcData = ohlcv.map((entry) => [
  entry.open,
  entry.high,
  entry.low,
  entry.close,
]);

// Extract volume data
const volumeData = ohlcv.map((entry) => entry.volume);

function calcMovingAverage(windowSize) {
  return ohlcv.map((_, i) => {
    if (i < windowSize - 1) {
      return null;
    }
    const sum = ohlcv
      .slice(i - windowSize + 1, i + 1)
      .reduce((acc, entry) => acc + entry.close, 0);
    return sum / windowSize;
  });
}

const formatVolume = (value) =>
  value.toLocaleString('en-US', {
    maximumSignificantDigits: 3,
    notation: 'compact',
    compactDisplay: 'short',
  });

const formatTooltipDollarValue = (value) =>
  value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

const formatAsDollar = (value) =>
  value.toLocaleString('en-US', {
    currency: 'USD',
    style: 'currency',
    maximumFractionDigits: 0,
  });

export default function CandlestickOverview() {
  const id = useId();
  const clipPathId = `${id}-clip-path`;
  const theme = useTheme();
  const [movingAverageWindow, setMovingAverageWindow] = React.useState(20);
  const [visibleAnnotations, setVisibleAnnotations] = React.useState([
    'dividends',
    'splits',
  ]);
  const movingAverageData = React.useMemo(
    () =>
      movingAverageWindow !== null ? calcMovingAverage(movingAverageWindow) : null,
    [movingAverageWindow],
  );

  const volumeBarColorGetter = ({ dataIndex }) => {
    if (dataIndex === 0) {
      return theme.palette.success.main;
    }

    // Color the volume bar green if the closing price is higher than or equal to the previous day's close,
    // red otherwise. This is how Yahoo Finance colors their volume bars.
    return ohlcv[dataIndex].close >= ohlcv[dataIndex - 1].close
      ? theme.palette.success.main
      : theme.palette.error.main;
  };

  return (
    <Stack width="100%">
      <Typography variant="h6" textAlign="center" mb={1}>
        Interactive Brokers Stock Price - 2025
      </Typography>
      <ChartsDataProviderPremium
        series={[
          {
            id: 'ohlc',
            type: 'ohlc',
            data: ohlcData,
            label: 'IBKR',
          },
          ...(movingAverageData !== null
            ? [
                {
                  id: 'moving-average',
                  type: 'line',
                  data: movingAverageData,
                  label: `${movingAverageWindow}-day Moving Average`,
                  color: '#42a5f5',
                },
              ]
            : []),
          {
            id: 'volume',
            type: 'bar',
            data: volumeData,
            label: 'Volume',
            colorGetter: volumeBarColorGetter,
            yAxisId: 'volume',
          },
        ]}
        xAxis={[
          {
            data: xData,
            scaleType: 'band',
            ordinalTimeTicks: [
              'years',
              'quarterly',
              'months',
              'biweekly',
              'weeks',
              'days',
            ],
            valueFormatter: (value) =>
              value.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            zoom: {
              filterMode: 'discard',
              slider: { enabled: true, preview: { seriesIds: ['ohlc'] } },
            },
          },
        ]}
        yAxis={[
          {
            id: 'price',
            valueFormatter: formatAsDollar,
            width: 32,
            position: 'right',
          },
          {
            id: 'volume',
            // Ensures that volume bars only take up to 20% of the chart height
            domainLimit: (min, max) => ({ min: 0, max: max.valueOf() * 5 }),
          },
        ]}
        height={400}
        margin={{ top: 8, bottom: 0, left: 8, right: 0 }}
      >
        <ChartsWrapper>
          <CandlestickToolbar
            movingAverageWindow={movingAverageWindow}
            onMovingAverageWindowChange={setMovingAverageWindow}
            visibleAnnotations={visibleAnnotations}
            onVisibleAnnotationsChange={setVisibleAnnotations}
          />
          <ChartsLayerContainer>
            <ChartsSvgLayer>
              <ChartsGrid horizontal vertical />
            </ChartsSvgLayer>
            <ChartsWebGLLayer>
              <CandlestickPlot />
            </ChartsWebGLLayer>
            <ChartsSvgLayer>
              <g clipPath={`url(#${clipPathId})`}>
                <BarPlot renderer="svg-batch" />
                <LinePlot />
                <CandlestickAnnotations
                  showDividends={visibleAnnotations.includes('dividends')}
                  showSplits={visibleAnnotations.includes('splits')}
                />
                <ChartsAxisHighlight x="line" y="line" />
              </g>
              <ChartsClipPath id={clipPathId} />
              <ChartsZoomSlider />
              <ChartsXAxis />
              <ChartsYAxis axisId="price" />
              <ChartsYAxis axisId="volume" />
              <CandlestickTooltip />
            </ChartsSvgLayer>
          </ChartsLayerContainer>
        </ChartsWrapper>
      </ChartsDataProviderPremium>
      <Typography variant="caption">Source: Yahoo Finance</Typography>
    </Stack>
  );
}

function CandlestickToolbar({
  movingAverageWindow,
  onMovingAverageWindowChange,
  visibleAnnotations,
  onVisibleAnnotationsChange,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const menuId = useId();
  const buttonId = useId();

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  return (
    <Toolbar>
      <Select
        size="small"
        variant="standard"
        value={movingAverageWindow ?? 'none'}
        onChange={(event) => {
          const val = event.target.value;
          onMovingAverageWindowChange(val === 'none' ? null : Number(val));
        }}
        renderValue={() => 'Moving Average'}
        sx={{ minWidth: 120, marginLeft: 1, marginRight: 1 }}
        disableUnderline
      >
        <MenuItem value="none">Off</MenuItem>
        <MenuItem value={20}>20-day</MenuItem>
        <MenuItem value={50}>50-day</MenuItem>
      </Select>
      <Select
        multiple
        size="small"
        variant="standard"
        value={visibleAnnotations}
        onChange={(event) => {
          onVisibleAnnotationsChange(event.target.value);
        }}
        renderValue={() => 'Annotations'}
        sx={{ minWidth: 120, marginLeft: 1, marginRight: 1 }}
        disableUnderline
        displayEmpty
      >
        <MenuItem value="dividends">
          <Checkbox
            size="small"
            checked={visibleAnnotations.includes('dividends')}
          />
          Dividends
        </MenuItem>
        <MenuItem value="splits">
          <Checkbox size="small" checked={visibleAnnotations.includes('splits')} />
          Stock Splits
        </MenuItem>
      </Select>
      <ToolbarButton
        id={buttonId}
        aria-controls={menuId}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        size="small"
        onClick={handleOpen}
      >
        <FileDownloadIcon fontSize="small" />
      </ToolbarButton>
      <Menu
        id={menuId}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <ChartsToolbarPrintExportTrigger
          render={<MenuItem dense />}
          onClick={handleClose}
        >
          Print
        </ChartsToolbarPrintExportTrigger>
        <ChartsToolbarImageExportTrigger
          render={<MenuItem dense />}
          options={{ type: 'image/png' }}
          onClick={handleClose}
        >
          Download as PNG
        </ChartsToolbarImageExportTrigger>
      </Menu>
    </Toolbar>
  );
}

function CandlestickTooltip() {
  const drawingArea = useDrawingArea();
  const axesTooltipData = useAxesTooltip({ directions: ['x'] });

  const tooltipData = axesTooltipData?.[0];

  if (!tooltipData) {
    return null;
  }

  const ohlcItem = tooltipData.seriesItems.find((item) => item.seriesId === 'ohlc');
  const movingAverageItem = tooltipData.seriesItems.find(
    (item) => item.seriesId === 'moving-average',
  );
  const volumeItem = tooltipData.seriesItems.find(
    (item) => item.seriesId === 'volume',
  );

  return (
    <foreignObject
      x={drawingArea.left}
      y={drawingArea.top}
      width={drawingArea.width}
      height={drawingArea.height}
    >
      <Stack
        direction="column"
        gap={0.5}
        sx={(theme) => ({
          ...theme.typography.caption,
          pointerEvents: 'none',
          marginLeft: theme.spacing(1),
          marginTop: theme.spacing(1),
        })}
      >
        <Stack
          direction="row"
          gap={1}
          sx={(theme) => ({
            width: 'min-content',
            paddingX: theme.spacing(1),
            paddingY: theme.spacing(0.5),
            background: theme.palette.background.paper,
          })}
        >
          <span>O:{formatTooltipDollarValue(ohlcItem.value[0])}</span>
          <span>H:{formatTooltipDollarValue(ohlcItem.value[1])}</span>
          <span>L:{formatTooltipDollarValue(ohlcItem.value[2])}</span>
          <span>C:{formatTooltipDollarValue(ohlcItem.value[3])}</span>
          <span>V:{formatVolume(volumeItem.value)}</span>
        </Stack>
        {movingAverageItem?.value != null && (
          <Stack
            sx={(theme) => ({
              width: 'min-content',
              paddingX: theme.spacing(1),
              paddingY: theme.spacing(0.5),
              background: theme.palette.background.paper,
            })}
          >
            <span>MA:{formatTooltipDollarValue(movingAverageItem.value)}</span>
          </Stack>
        )}
      </Stack>
    </foreignObject>
  );
}

function CandlestickAnnotations({ showDividends, showSplits }) {
  const drawingArea = useDrawingArea();
  const xScale = useXScale();
  const bandwidth = xScale.bandwidth();

  const getX = (dateStr) => {
    const match = xData.find((d) => d.getTime() === Date.parse(dateStr));
    if (!match) {
      return null;
    }
    const pos = xScale(match);
    return pos === undefined ? null : pos + bandwidth / 2;
  };

  return (
    <g>
      {showDividends &&
        dividends.map(({ date, amount }) => {
          const x = getX(date);
          if (x === null) {
            return null;
          }
          return (
            <g key={`dividend-${date}`}>
              <line
                x1={x}
                y1={drawingArea.top}
                x2={x}
                y2={drawingArea.top + drawingArea.height}
                stroke="#4caf50"
                strokeWidth={1}
                strokeDasharray="4 2"
              />
              <text x={x + 4} y={drawingArea.top + 14} fontSize={10} fill="#4caf50">
                D ${amount}
              </text>
            </g>
          );
        })}
      {showSplits &&
        stockSplits.map(({ date, ratio }) => {
          const x = getX(date);
          if (x === null) {
            return null;
          }
          return (
            <g key={`split-${date}`}>
              <line
                x1={x}
                y1={drawingArea.top}
                x2={x}
                y2={drawingArea.top + drawingArea.height}
                stroke="#9c27b0"
                strokeWidth={1}
                strokeDasharray="4 2"
              />
              <text x={x + 4} y={drawingArea.top + 14} fontSize={10} fill="#9c27b0">
                Split {ratio}:1
              </text>
            </g>
          );
        })}
    </g>
  );
}
