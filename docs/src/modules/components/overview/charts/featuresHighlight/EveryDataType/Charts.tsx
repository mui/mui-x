import * as React from 'react';
import { BarPlot } from '@mui/x-charts/BarChart';
import { LinePlot, MarkPlot } from '@mui/x-charts/LineChart';
import { ChartsAxis } from '@mui/x-charts/ChartsAxis';
import { pieArcLabelClasses, PieChart } from '@mui/x-charts/PieChart';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { ChartDataProvider } from '@mui/x-charts/ChartDataProvider';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';

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
  return (
    <ChartDataProvider
      colors={['var(--palette-color-0)', 'var(--palette-color-1)', 'var(--palette-color-2)']}
      series={[
        {
          type: 'line',
          label: 'ratio',
          dataKey: 'ratio',
          yAxisId: 'ratio',

          valueFormatter: formatRatio,
        },
        { label: 'turnover', type: 'bar', dataKey: 'revenueFigure', valueFormatter: formatUSD },
        { label: 'net profit', type: 'bar', dataKey: 'benef', valueFormatter: formatUSD },
      ]}
      dataset={dataset}
      margin={2}
      xAxis={[{ height: 3, scaleType: 'band', dataKey: 'x', disableTicks: true }]}
      yAxis={[
        { width: 3, disableTicks: true },
        { id: 'ratio', position: 'none' },
      ]}
    >
      <ChartsSurface>
        <BarPlot />
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

export const desktopOS = [
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

export const valueFormatter = (item: { value: number }) => `${item.value}%`;

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
          valueFormatter,
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
