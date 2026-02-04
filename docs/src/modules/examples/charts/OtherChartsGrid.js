import ArcDesign from 'docsx/data/charts/gauge/ArcDesign';
import CompositionExample from 'docsx/data/charts/gauge/CompositionExample';
import BasicSparkLine from 'docsx/data/charts/sparkline/BasicSparkLine';
import NpmSparkLine from 'docsx/data/charts/sparkline/NpmSparkLine';
import { ChartThumbnailCard, ChartThumbnailGridWrapper } from './ChartExampleThumbnailGrid';

const chartData = [
  {
    title: 'Arc Design',
    ChartComponent: ArcDesign,
    link: '/x/react-charts/gauge/#ArcDesign',
  },
  {
    title: 'Customized Gauge with Pointer',
    ChartComponent: CompositionExample,
    link: '/x/react-charts/gauge/#CompositionExample',
  },
  {
    title: 'Sparkline',
    ChartComponent: BasicSparkLine,
    link: '/x/react-charts/sparkline/#BasicSparkLine',
  },
  {
    title: 'Sparkline with metric',
    ChartComponent: NpmSparkLine,
    link: '/x/react-charts/sparkline/#NpmSparkLine',
  },
];

export default function OtherChartsGrid() {
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
