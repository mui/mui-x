import * as React from 'react';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import { dataset } from '../dataset/gdpPerCapitaEvolution';

export default function ChartsToolbarRangeButtons() {
  return (
    <LineChartPro
      dataset={dataset}
      xAxis={[{ scaleType: 'time', dataKey: 'date', zoom: true, tickNumber: 5 }]}
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
      initialRangeKey="5Y"
      slotProps={{
        toolbar: {
          rangeButtons: [
            { label: '5Y', value: { unit: 'year', step: 5 } },
            { label: '10Y', value: { unit: 'year', step: 10 } },
            { label: '20Y', value: { unit: 'year', step: 20 } },
            { label: 'All', value: null },
          ],
        },
      }}
    />
  );
}
