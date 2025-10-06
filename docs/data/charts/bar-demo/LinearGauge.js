import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
// import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';

const dataset = [
  { feature: 'Progress', completed: 60, inProgress: 25, pending: 15 },
];

const chartSetting = {
  height: 200,
  sx: (theme) => ({
    '& .MuiBarElement-root': {
      outline: `2px solid ${theme.palette.background.paper}`,
    },
  }),
};

const valueFormatter = (value) => (value === null ? '' : `${value}%`);

export default function LinearGauge() {
  return (
    <BarChart
      dataset={dataset}
      yAxis={[
        {
          scaleType: 'band',
          dataKey: 'feature',
          width: 60,
        },
      ]}
      xAxis={[{ valueFormatter }]}
      series={[
        { dataKey: 'completed', label: 'Completed', valueFormatter, stack: 'total' },
        {
          dataKey: 'inProgress',
          label: 'In Progress',
          valueFormatter,
          stack: 'total',
        },
        { dataKey: 'pending', label: 'Pending', valueFormatter, stack: 'total' },
      ].map((series) => ({
        ...series,
        highlightScope: {
          highlighted: 'item',
          faded: 'global',
        },
      }))}
      layout="horizontal"
      grid={{ vertical: true }}
      {...chartSetting}
      slotProps={{ tooltip: { trigger: 'item' } }}
      borderRadius={4}
    />
  );
}
