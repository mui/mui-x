import { BarPlot } from '@mui/x-charts/BarChart';
import { LinePlot, MarkPlot } from '@mui/x-charts/LineChart';
import { RadarChart } from '@mui/x-charts/RadarChart';
import { FunnelChart } from '@mui/x-charts-pro/FunnelChart';
import { ChartsAxis } from '@mui/x-charts/ChartsAxis';
import { pieArcLabelClasses, PieChart } from '@mui/x-charts/PieChart';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { ChartDataProvider } from '@mui/x-charts/ChartDataProvider';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { useTheme } from '@mui/material/styles';

// Data about ALphabet

const dataset = [
  { x: 2020, revenueFigure: 182_527_000_000, benef: 40_269_000_000 },
  { x: 2021, revenueFigure: 257_637_000_000, benef: 76_033_000_000 },
  { x: 2022, revenueFigure: 282_836_000_000, benef: 59_972_000_000 },
  { x: 2023, revenueFigure: 307_394_000_000, benef: 73_795_000_000 },
  { x: 2024, revenueFigure: 350_018_000_000, benef: 100_118_000_000 },
].map((item) => ({ ...item, ratio: (100 * item.benef) / item.revenueFigure }));

const formatRatio = (value: number | null) =>
  value === null
    ? ''
    : new Intl.NumberFormat('en-US', { style: 'percent', maximumSignificantDigits: 3 }).format(
        value,
      );

const formatUSD = (value: number | null) =>
  value === null
    ? ''
    : new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        compactDisplay: 'short',
        notation: 'compact',
      }).format(value);

export function LineAndBar() {
  const theme = useTheme();
  return (
    <ChartDataProvider
      colors={[
        (theme.vars || theme).palette.text.primary,
        'var(--palette-color-3)',
        'var(--palette-color-4)',
      ]}
      series={[
        {
          type: 'line',
          label: 'ratio',
          dataKey: 'ratio',
          yAxisId: 'ratio',
          valueFormatter: formatRatio,
          showMark: true,
        },
        { label: 'turnover', type: 'bar', dataKey: 'revenueFigure', valueFormatter: formatUSD },
        { label: 'net profit', type: 'bar', dataKey: 'benef', valueFormatter: formatUSD },
      ]}
      dataset={dataset}
      margin={2}
      xAxis={[
        {
          height: 3,
          scaleType: 'band',
          dataKey: 'x',
          disableTicks: true,
          valueFormatter: (value) => String(value),
        },
      ]}
      yAxis={[
        { width: 3, disableTicks: true },
        { id: 'ratio', position: 'none' },
      ]}
    >
      <ChartsSurface
        sx={{
          '& .MuiLineElement-root': { strokeWidth: 1.5 },
          '& .MuiMarkElement-root': { r: 3, strokeWidth: 1.5 },
        }}
      >
        <BarPlot borderRadius={4} />
        <LinePlot />
        <MarkPlot />
        <ChartsAxis />
      </ChartsSurface>
      <ChartsTooltip trigger="axis" disablePortal />
    </ChartDataProvider>
  );
}

// Data derived from https://gs.statcounter.com/os-market-share/desktop/worldwide/2023
// And https://gs.statcounter.com/os-market-share/mobile/worldwide/2023
// And https://gs.statcounter.com/platform-market-share/desktop-mobile-tablet/worldwide/2023
// For the month of December 2023

const desktopOS = [
  {
    label: 'Windows',
    value: 72.72,
  },
  {
    label: 'OS X',
    value: 16.38,
  },
  {
    label: 'Linux',
    value: 3.83,
  },
  {
    label: 'Chrome OS',
    value: 2.42,
  },
  {
    label: 'Other',
    value: 4.65,
  },
];

const pieValueFormatter = (item: { value: number }) => `${item.value}%`;

export function Pie() {
  return (
    <PieChart
      colors={[
        'var(--palette-color-0)',
        'var(--palette-color-1)',
        'var(--palette-color-2)',
        'var(--palette-color-3)',
        'var(--palette-color-4)',
      ]}
      series={[
        {
          data: desktopOS,
          valueFormatter: pieValueFormatter,
        },
      ]}
      slotProps={{ tooltip: { disablePortal: true } }}
      sx={{
        [`& .${pieArcLabelClasses.root}`]: {
          fontWeight: 'bold',
        },
      }}
    />
  );
}

// Data from https://ourworldindata.org/emissions-by-fuel

function radarValueFormatter(v: number | null) {
  if (v === null) {
    return 'NaN';
  }
  return `${v.toLocaleString()}t CO2/pers`;
}

export function Radar() {
  return (
    <RadarChart
      colors={[
        'var(--palette-color-0)',
        'var(--palette-color-1)',
        'var(--palette-color-2)',
        'var(--palette-color-3)',
        'var(--palette-color-4)',
      ]}
      series={[
        {
          hideMark: true,
          label: 'USA',
          data: [6.65, 2.76, 5.15, 0.19, 0.07, 0.12],
          valueFormatter: radarValueFormatter,
        },
        {
          hideMark: true,
          label: 'Australia',
          data: [5.52, 5.5, 3.19, 0.51, 0.15, 0.11],
          valueFormatter: radarValueFormatter,
        },
        {
          hideMark: true,
          label: 'United Kingdom',
          data: [2.26, 0.29, 2.03, 0.05, 0.04, 0.06],
          valueFormatter: radarValueFormatter,
        },
      ]}
      radar={{
        metrics: ['Oil', 'Coal', 'Gas', 'Flaring', 'Other\nindustry', 'Cement'],
      }}
      slotProps={{ tooltip: { disablePortal: true } }}
    />
  );
}

export function Funnel() {
  return (
    <FunnelChart
      colors={[
        'var(--palette-color-0)',
        'var(--palette-color-1)',
        'var(--palette-color-2)',
        'var(--palette-color-3)',
        'var(--palette-color-4)',
      ]}
      series={[
        {
          curve: 'linear',
          variant: 'outlined',
          borderRadius: 2,
          valueFormatter: ({ value }) => `${value}%`,
          data: [
            { value: 100, label: 'Visitors' },
            { value: 68, label: 'Pick item' },
            { value: 41, label: 'Start payment' },
            { value: 13, label: 'Paid' },
          ],
        },
      ]}
      gap={6}
      slotProps={{ tooltip: { disablePortal: true } }}
    />
  );
}
