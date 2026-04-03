import * as React from 'react';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import { ChartsToolbarRangeButtonTrigger } from '@mui/x-charts-pro/ChartsToolbarPro';
import { Toolbar } from '@mui/x-charts/Toolbar';

const startDate = new Date(2023, 0, 1);
const dates = Array.from(
  { length: 365 * 2 },
  (_, i) => new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000),
);
const values = dates.map(
  (_, i) => 100 + 50 * Math.sin(i / 30) + 20 * Math.sin(i / 7) + i * 0.05,
);

const chartConfiguration = {
  xAxis: [{ scaleType: 'time', data: dates, zoom: true }],
  series: [{ data: values, showMark: false, label: 'Value' }],
  height: 300,
} as const;

export default function ChartsToolbarCustomRangeButtons() {
  return (
    <LineChartPro
      {...chartConfiguration}
      showToolbar
      slots={{
        toolbar: () => {
          return (
            <Toolbar>
              <ChartsToolbarRangeButtonTrigger value={{ unit: 'month' }}>
                1 month
              </ChartsToolbarRangeButtonTrigger>
              <ChartsToolbarRangeButtonTrigger value={null}>
                Everything
              </ChartsToolbarRangeButtonTrigger>
            </Toolbar>
          );
        },
      }}
    />
  );
}
