import * as React from 'react';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import { dataset } from '../dataset/gdpPerCapitaEvolution';

const INITIAL_START = 75;

export default function ChartsToolbarRangeButtonsInitialSelection() {
  return (
    <LineChartPro
      dataset={dataset}
      xAxis={[{ id: 'x', scaleType: 'time', dataKey: 'date', zoom: true, tickNumber: 5 }]}
      yAxis={[
        { width: 60, valueFormatter: (v: number) => `$${(v / 1000).toFixed(0)}k` },
      ]}
      series={[
        { dataKey: 'fr', label: 'France' },
        { dataKey: 'gb', label: 'UK' },
        { dataKey: 'dl', label: 'Germany' },
      ]}
      height={300}
      showToolbar
      initialZoom={[{ axisId: 'x', start: INITIAL_START, end: 100 }]}
      slotProps={{
        toolbar: {
          rangeButtons: [
            { label: 'Last ¼', value: () => ({ start: 75, end: 100 }) },
            { label: 'Last ½', value: () => ({ start: 50, end: 100 }) },
            { label: 'All', value: null },
          ],
        },
      }}
    />
  );
}
