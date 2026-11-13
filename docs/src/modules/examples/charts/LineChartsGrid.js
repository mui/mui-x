import SimpleLineChart from 'docs/data/charts/line-demo/demos/simple-line-chart/SimpleLineChart';
import DashedLineChart from 'docs/data/charts/line-demo/demos/dashed-line-chart/DashedLineChart';
import BiaxialLineChart from 'docs/data/charts/line-demo/demos/biaxial-line-chart/BiaxialLineChart';
import LineChartWithReferenceLines from 'docs/data/charts/line-demo/demos/line-chart-with-reference-lines/LineChartWithReferenceLines';
import LineChartConnectNulls from 'docs/data/charts/line-demo/demos/line-chart-connect-nulls/LineChartConnectNulls';
import LineWithUncertaintyArea from 'docs/data/charts/line-demo/demos/line-with-uncertainty-area/LineWithUncertaintyArea';
import CustomLineMarks from 'docs/data/charts/line-demo/demos/custom-line-marks/CustomLineMarks';
import Combining from 'docs/data/charts/quickstart/demos/combining/Combining';
import { ChartThumbnailCard, ChartThumbnailGridWrapper } from './ChartExampleThumbnailGrid';

const chartData = [
  {
    title: 'Simple Line Chart',
    ChartComponent: SimpleLineChart,
    link: '/x/react-charts/line-demo/#BiaxialLineChart',
  },
  {
    title: 'Dashed Line Chart',
    ChartComponent: DashedLineChart,
    link: '/x/react-charts/line-demo/#DashedLineChart',
  },
  {
    title: 'Biaxial Line Chart',
    ChartComponent: BiaxialLineChart,
    link: '/x/react-charts/line-demo/#BiaxialLineChart',
  },
  {
    title: 'Line Chart with Reference Lines',
    ChartComponent: LineChartWithReferenceLines,
    link: '/x/react-charts/line-demo/#LineChartWithReferenceLines',
  },
  {
    title: 'Line Chart Connect Nulls',
    ChartComponent: LineChartConnectNulls,
    link: '/x/react-charts/line-demo/#LineChartConnectNulls',
  },
  {
    title: 'Line with Uncertainty Area',
    ChartComponent: LineWithUncertaintyArea,
    link: '/x/react-charts/line-demo/#LineWithUncertaintyArea',
  },
  {
    title: 'Custom Line Marks',
    ChartComponent: CustomLineMarks,
    link: '/x/react-charts/line-demo/#CustomLineMarks',
  },
  {
    title: 'Line and Bar composed',
    ChartComponent: Combining,
    link: '/x/react-charts/quickstart/#Combining',
  },
];

export default function LineChartsGrid() {
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
