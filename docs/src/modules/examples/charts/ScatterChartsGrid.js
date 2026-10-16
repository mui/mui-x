import SimpleScatterChart from 'docs/data/charts/scatter-demo/demos/simple-scatter-chart/SimpleScatterChart';
import MultipleYAxesScatterChart from 'docs/data/charts/scatter-demo/demos/multiple-y-axes-scatter-chart/MultipleYAxesScatterChart';
import { ChartThumbnailCard, ChartThumbnailGridWrapper } from './ChartExampleThumbnailGrid';

const chartData = [
  {
    title: 'Simple Scatter Chart',
    ChartComponent: SimpleScatterChart,
    link: '/x/react-charts/scatter-demo/#SimpleScatterChart',
  },
  {
    title: 'Multiple Y Axes Scatter Chart',
    ChartComponent: MultipleYAxesScatterChart,
    link: '/x/react-charts/scatter-demo/#MultipleYAxesScatterChart',
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
