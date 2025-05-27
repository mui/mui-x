import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';

export interface ChartsRendererProps {
  categories: string[];
  series: Array<{ id: string; label: string; data: (number | null)[] }>;
  chartType: string;
}

export function ChartsRenderer({ categories, series, chartType }: ChartsRendererProps) {
  if (chartType === 'bar') {
    // TODO: instead of returning charts directly, each chart can have a helper that will get the configuration and set the props (and add the defaults)
    return (
      <BarChart
        xAxis={[{ data: categories }]}
        series={series.map((s) => ({
          data: s.data,
          label: s.label,
        }))}
        height={300}
        width={500}
      />
    );
  }

  if (chartType === 'line') {
    return (
      <LineChart
        xAxis={[{ data: categories, scaleType: 'point' }]}
        yAxis={[{ min: 0 }]}
        series={series.map((s) => ({
          data: s.data,
          label: s.label,
        }))}
        height={300}
        width={500}
      />
    );
  }

  if (chartType === 'pie') {
    return (
      <PieChart
        series={[
          {
            // TODO: should not be here
            data: series[0]?.data.map((item, index) => ({
              id: index,
              value: item || 0,
              label: categories[index],
            })),
            outerRadius: 120,
          },
        ]}
        width={300}
        height={300}
        slotProps={{
          legend: {
            direction: 'horizontal',
            position: {
              vertical: 'bottom',
              horizontal: 'center',
            },
          },
        }}
      />
    );
  }

  return <span>No chart renderer found for the chart type: {chartType}</span>;
}
