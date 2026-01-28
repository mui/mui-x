import TwoLevelPieChart from 'docsx/data/charts/pie-demo/TwoLevelPieChart';
import StraightAnglePieChart from 'docsx/data/charts/pie-demo/StraightAnglePieChart';
import PieChartWithCustomizedLabel from 'docsx/data/charts/pie-demo/PieChartWithCustomizedLabel';
import PieChartWithCenterLabel from 'docsx/data/charts/pie-demo/PieChartWithCenterLabel';
import PieChartWithPaddingAngle from 'docsx/data/charts/pie-demo/PieChartWithPaddingAngle';
import PieChartWithCustomLegendAndTooltip from 'docsx/data/charts/pie-demo/PieChartWithCustomLegendAndTooltip';
import { ChartThumbnailCard, ChartThumbnailGridWrapper } from './ChartExampleThumbnailGrid';

const chartData = [
  {
    title: 'Two Level Pie Chart',
    ChartComponent: TwoLevelPieChart,
    link: '/x/react-charts/pie-demo/#TwoLevelPieChart',
  },
  {
    title: 'Straight Angle Pie Chart',
    ChartComponent: StraightAnglePieChart,
    link: '/x/react-charts/pie-demo/#StraightAnglePieChart',
  },
  {
    title: 'Pie Chart with Customized Label',
    ChartComponent: PieChartWithCustomizedLabel,
    link: '/x/react-charts/pie-demo/#PieChartWithCustomizedLabel',
  },
  {
    title: 'Pie Chart with Center Label',
    ChartComponent: PieChartWithCenterLabel,
    link: '/x/react-charts/pie-demo/#PieChartWithCenterLabel',
  },
  {
    title: 'Pie Chart with Padding Angle',
    ChartComponent: PieChartWithPaddingAngle,
    link: '/x/react-charts/pie-demo/#PieChartWithPaddingAngle',
  },
  {
    title: 'Pie Chart with Custom Legend',
    ChartComponent: PieChartWithCustomLegendAndTooltip,
    link: '/x/react-charts/pie-demo/#PieChartWithCustomLegendAndTooltip',
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
