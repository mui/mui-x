import * as React from 'react';
import { ChartThumbnailCard, ChartThumbnailGridWrapper } from './ChartExampleThumbnailGrid';
import SimpleScatterChart from '../data/charts/scatter-demo/SimpleScatterChart';
import MultipleYAxesScatterChart from '../data/charts/scatter-demo/MultipleYAxesScatterChart';

const chartData = [
  {
    title: 'Simple Scatter Chart',
    ChartComponent: SimpleScatterChart,
    link: 'https://github.com/mui/mui-x/blob/v8.10.2/docs/data/charts/scatter-demo/SimpleScatterChart.tsx',
  },
  {
    title: 'Multiple Y Axes Scatter Chart',
    ChartComponent: MultipleYAxesScatterChart,
    link: 'https://github.com/mui/mui-x/blob/v8.10.2/docs/data/charts/scatter-demo/MultipleYAxesScatterChart.tsx',
  },
];

export default function ScatterChartsGrid() {
  return (
    <ChartThumbnailGridWrapper>
      {chartData.map((chart) => (
        <ChartThumbnailCard
          key={chart.title}
          title={chart.title}
          link={chart.link}
          ChartComponent={chart.ChartComponent}
        />
      ))}
    </ChartThumbnailGridWrapper>
  );
}
