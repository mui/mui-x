import * as React from 'react';
import { ChartThumbnailCard, ChartThumbnailGridWrapper } from './ChartExampleThumbnailGrid';
import SimpleAreaChart from '../data/charts/areas-demo/SimpleAreaChart';
import StackedAreaChart from '../data/charts/areas-demo/StackedAreaChart';
import PercentAreaChart from '../data/charts/areas-demo/PercentAreaChart';
import AreaChartConnectNulls from '../data/charts/areas-demo/AreaChartConnectNulls';

const chartData = [
  {
    title: 'Simple Area Chart',
    ChartComponent: SimpleAreaChart,
    link: 'https://github.com/mui/mui-x/blob/v8.10.2/docs/data/charts/areas-demo/SimpleAreaChart.tsx',
  },
  {
    title: 'Stacked Area Chart',
    ChartComponent: StackedAreaChart,
    link: 'https://github.com/mui/mui-x/blob/v8.10.2/docs/data/charts/areas-demo/StackedAreaChart.tsx',
  },
  {
    title: 'Percent Area Chart',
    ChartComponent: PercentAreaChart,
    link: 'https://github.com/mui/mui-x/blob/v8.10.2/docs/data/charts/areas-demo/PercentAreaChart.tsx',
  },
  {
    title: 'Area Chart Connect Nulls',
    ChartComponent: AreaChartConnectNulls,
    link: 'https://github.com/mui/mui-x/blob/v8.10.2/docs/data/charts/areas-demo/AreaChartConnectNulls.tsx',
  },
];

export default function AreaChartsGrid() {
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
