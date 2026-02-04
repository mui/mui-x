import SimpleBarChart from 'docsx/data/charts/bar-demo/SimpleBarChart';
import StackedBarChart from 'docsx/data/charts/bar-demo/StackedBarChart';
import MixedBarChart from 'docsx/data/charts/bar-demo/MixedBarChart';
import PositiveAndNegativeBarChart from 'docsx/data/charts/bar-demo/PositiveAndNegativeBarChart';
import BarChartStackedBySign from 'docsx/data/charts/bar-demo/BarChartStackedBySign';
import BiaxialBarChart from 'docsx/data/charts/bar-demo/BiaxialBarChart';
import PopulationPyramidBarChart from 'docsx/data/charts/bar-demo/PopulationPyramidBarChart';
import { ChartThumbnailCard, ChartThumbnailGridWrapper } from './ChartExampleThumbnailGrid';

const chartData = [
  {
    title: 'Simple Bar Chart',
    ChartComponent: SimpleBarChart,
    link: '/x/react-charts/bar-demo/#SimpleBarChart',
  },
  {
    title: 'Stacked Bar Chart',
    ChartComponent: StackedBarChart,
    link: '/x/react-charts/bar-demo/#StackedBarChart',
  },
  {
    title: 'Mixed Bar Chart',
    ChartComponent: MixedBarChart,
    link: '/x/react-charts/bar-demo/#MixedBarChart',
  },
  {
    title: 'Positive and Negative Bar Chart',
    ChartComponent: PositiveAndNegativeBarChart,
    link: '/x/react-charts/bar-demo/#PositiveAndNegativeBarChart',
  },
  {
    title: 'Bar Chart Stacked by Sign',
    ChartComponent: BarChartStackedBySign,
    link: '/x/react-charts/bar-demo/#BarChartStackedBySign',
  },
  {
    title: 'Biaxial Bar Chart',
    ChartComponent: BiaxialBarChart,
    link: '/x/react-charts/bar-demo/#BiaxialBarChart',
  },
  {
    title: 'Population Pyramid',
    ChartComponent: PopulationPyramidBarChart,
    link: '/x/react-charts/bar-demo/#PopulationPyramidBarChart',
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
          aspectRatio={chart.title === 'Population Pyramid Bar Chart' ? '90%' : undefined} // temporary fix to avoid Y axis labels from being cramped
        />
      ))}
    </ChartThumbnailGridWrapper>
  );
}
