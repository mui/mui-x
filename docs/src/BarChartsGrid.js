import * as React from 'react';
import { ChartThumbnailCard, ChartThumbnailGridWrapper } from './ChartExampleThumbnailGrid';
import SimpleBarChart from '../data/charts/bar-demo/SimpleBarChart';
import StackedBarChart from '../data/charts/bar-demo/StackedBarChart';
import MixedBarChart from '../data/charts/bar-demo/MixedBarChart';
import PositiveAndNegativeBarChart from '../data/charts/bar-demo/PositiveAndNegativeBarChart';
import BarChartStackedBySign from '../data/charts/bar-demo/BarChartStackedBySign';
import BiaxialBarChart from '../data/charts/bar-demo/BiaxialBarChart';
import PopulationPyramidBarChart from '../data/charts/bar-demo/PopulationPyramidBarChart';

const chartData = [
  {
    title: 'Simple Bar Chart',
    ChartComponent: SimpleBarChart,
    link: 'https://github.com/mui/mui-x/blob/v8.10.2/docs/data/charts/bar-demo/SimpleBarChart.tsx',
  },
  {
    title: 'Stacked Bar Chart',
    ChartComponent: StackedBarChart,
    link: 'https://github.com/mui/mui-x/blob/v8.10.2/docs/data/charts/bar-demo/StackedBarChart.tsx',
  },
  {
    title: 'Mixed Bar Chart',
    ChartComponent: MixedBarChart,
    link: 'https://github.com/mui/mui-x/blob/v8.10.2/docs/data/charts/bar-demo/MixedBarChart.tsx',
  },
  {
    title: 'Positive and Negative Bar Chart',
    ChartComponent: PositiveAndNegativeBarChart,
    link: 'https://github.com/mui/mui-x/blob/v8.10.2/docs/data/charts/bar-demo/PositiveAndNegativeBarChart.tsx',
  },
  {
    title: 'Bar Chart Stacked by Sign',
    ChartComponent: BarChartStackedBySign,
    link: 'https://github.com/mui/mui-x/blob/v8.10.2/docs/data/charts/bar-demo/BarChartStackedBySign.tsx',
  },
  {
    title: 'Biaxial Bar Chart',
    ChartComponent: BiaxialBarChart,
    link: 'https://github.com/mui/mui-x/blob/v8.10.2/docs/data/charts/bar-demo/BiaxialBarChart.tsx',
  },
  {
    title: 'Population Pyramid Bar Chart',
    ChartComponent: PopulationPyramidBarChart,
    link: 'https://github.com/mui/mui-x/blob/v8.10.2/docs/data/charts/bar-demo/PopulationPyramidBarChart.tsx',
  },
];

export default function BarChartsGrid() {
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
