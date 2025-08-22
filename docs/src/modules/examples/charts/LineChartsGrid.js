import * as React from 'react';
import SimpleLineChart from 'docsx/data/charts/line-demo/SimpleLineChart';
import DashedLineChart from 'docsx/data/charts/line-demo/DashedLineChart';
import BiaxialLineChart from 'docsx/data/charts/line-demo/BiaxialLineChart';
import LineChartWithReferenceLines from 'docsx/data/charts/line-demo/LineChartWithReferenceLines';
import LineChartConnectNulls from 'docsx/data/charts/line-demo/LineChartConnectNulls';
import LiveLineChartNoSnap from 'docsx/data/charts/line-demo/LiveLineChartNoSnap';
import LineWithUncertaintyArea from 'docsx/data/charts/line-demo/LineWithUncertaintyArea';
import CustomLineMarks from 'docsx/data/charts/line-demo/CustomLineMarks';
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
    title: 'Live Line Chart',
    ChartComponent: LiveLineChartNoSnap,
    link: '/x/react-charts/line-demo/#LiveLineChartNoSnap',
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
