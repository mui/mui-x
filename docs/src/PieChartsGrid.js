import * as React from 'react';
import { ChartThumbnailCard, ChartThumbnailGridWrapper } from './ChartExampleThumbnailGrid';
import TwoLevelPieChart from '../data/charts/pie-demo/TwoLevelPieChart';
import StraightAnglePieChart from '../data/charts/pie-demo/StraightAnglePieChart';
import PieChartWithCustomizedLabel from '../data/charts/pie-demo/PieChartWithCustomizedLabel';
import PieChartWithCenterLabel from '../data/charts/pie-demo/PieChartWithCenterLabel';
import PieChartWithPaddingAngle from '../data/charts/pie-demo/PieChartWithPaddingAngle';
import PieChartWithCustomLegendAndTooltip from '../data/charts/pie-demo/PieChartWithCustomLegendAndTooltip';

const chartData = [
  {
    title: 'Two Level Pie Chart',
    ChartComponent: TwoLevelPieChart,
    link: 'https://github.com/mui/mui-x/blob/v8.10.2/docs/data/charts/pie-demo/TwoLevelPieChart.tsx',
  },
  {
    title: 'Straight Angle Pie Chart',
    ChartComponent: StraightAnglePieChart,
    link: 'https://github.com/mui/mui-x/blob/v8.10.2/docs/data/charts/pie-demo/StraightAnglePieChart.tsx',
  },
  {
    title: 'Pie Chart with Customized Label',
    ChartComponent: PieChartWithCustomizedLabel,
    link: 'https://github.com/mui/mui-x/blob/v8.10.2/docs/data/charts/pie-demo/PieChartWithCustomizedLabel.tsx',
  },
  {
    title: 'Pie Chart with Center Label',
    ChartComponent: PieChartWithCenterLabel,
    link: 'https://github.com/mui/mui-x/blob/v8.10.2/docs/data/charts/pie-demo/PieChartWithCenterLabel.tsx',
  },
  {
    title: 'Pie Chart with Padding Angle',
    ChartComponent: PieChartWithPaddingAngle,
    link: 'https://github.com/mui/mui-x/blob/v8.10.2/docs/data/charts/pie-demo/PieChartWithPaddingAngle.tsx',
  },
  {
    title: 'Pie Chart with Custom Legend',
    ChartComponent: PieChartWithCustomLegendAndTooltip,
    link: 'https://github.com/mui/mui-x/blob/v8.10.2/docs/data/charts/pie-demo/PieChartWithCustomLegendAndTooltip.tsx',
  },
];

export default function PieChartsGrid() {
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
