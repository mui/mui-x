import * as React from 'react';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import { ChartsToolbarRangeButtonTrigger } from '@mui/x-charts-pro/ChartsToolbarPro';
import { Toolbar } from '@mui/x-charts/Toolbar';
import { dataset } from '../dataset/gdpPerCapitaEvolution';

export default function ChartsToolbarCustomRangeButtons() {
  return (
    <LineChartPro
      dataset={dataset}
      xAxis={[{ scaleType: 'time', dataKey: 'date', zoom: true, tickNumber: 5 }]}
      yAxis={[{ width: 60, valueFormatter: (v) => `$${(v / 1000).toFixed(0)}k` }]}
      series={[
        { dataKey: 'fr', label: 'France' },
        { dataKey: 'gb', label: 'UK' },
        { dataKey: 'dl', label: 'Germany' },
      ]}
      height={300}
      showToolbar
      slots={{
        toolbar: () => (
          <Toolbar>
            <ChartsToolbarRangeButtonTrigger
              label="10 years"
              value={{ unit: 'year', step: 10 }}
            >
              10 years
            </ChartsToolbarRangeButtonTrigger>
            <ChartsToolbarRangeButtonTrigger label="Everything" value={null}>
              Everything
            </ChartsToolbarRangeButtonTrigger>
          </Toolbar>
        ),
      }}
    />
  );
}
