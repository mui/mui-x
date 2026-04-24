import SimpleAreaChart from 'docs/data/charts/areas-demo/SimpleAreaChart';
import StackedAreaChart from 'docs/data/charts/areas-demo/StackedAreaChart';
import PercentAreaChart from 'docs/data/charts/areas-demo/PercentAreaChart';
import AreaChartConnectNulls from 'docs/data/charts/areas-demo/AreaChartConnectNulls';
import { ChartThumbnailCard, ChartThumbnailGridWrapper } from './ChartExampleThumbnailGrid';

const chartData = [
  {
    title: 'Simple Area Chart',
    ChartComponent: SimpleAreaChart,
    link: '/x/react-charts/areas-demo/#SimpleAreaChart',
  },
  {
    title: 'Stacked Area Chart',
    ChartComponent: StackedAreaChart,
    link: '/x/react-charts/areas-demo/#StackedAreaChart',
  },
  {
    title: 'Percent Area Chart',
    ChartComponent: PercentAreaChart,
    link: '/x/react-charts/areas-demo/#PercentAreaChart',
  },
  {
    title: 'Area Chart Connect Nulls',
    ChartComponent: AreaChartConnectNulls,
    link: '/x/react-charts/areas-demo/#AreaChartConnectNulls',
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
