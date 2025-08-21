import * as React from 'react';
import { ChartThumbnailCard, ChartThumbnailGridWrapper } from './ChartExampleThumbnailGrid';
import SimpleLineChart from '../data/charts/line-demo/SimpleLineChart';
import DashedLineChart from '../data/charts/line-demo/DashedLineChart';
import BiaxialLineChart from '../data/charts/line-demo/BiaxialLineChart';
import LineChartWithReferenceLines from '../data/charts/line-demo/LineChartWithReferenceLines';
import LineChartConnectNulls from '../data/charts/line-demo/LineChartConnectNulls';
import LiveLineChartNoSnap from '../data/charts/line-demo/LiveLineChartNoSnap';
import LineWithUncertaintyArea from '../data/charts/line-demo/LineWithUncertaintyArea';
import CustomLineMarks from '../data/charts/line-demo/CustomLineMarks';

const chartData = [
  {
    title: 'Simple Line Chart',
    ChartComponent: SimpleLineChart,
    link: 'https://github.com/mui/mui-x/blob/v8.10.2/docs/data/charts/line-demo/BiaxialLineChart.tsx',
  },
  {
    title: 'Dashed Line Chart',
    ChartComponent: DashedLineChart,
    link: 'http://github.com/mui/mui-x/blob/v8.10.2/docs/data/charts/line-demo/DashedLineChart.tsx',
  },
  {
    title: 'Biaxial Line Chart',
    ChartComponent: BiaxialLineChart,
    link: 'https://github.com/mui/mui-x/blob/v8.10.2/docs/data/charts/line-demo/BiaxialLineChart.tsx',
  },
  {
    title: 'Line Chart with Reference Lines',
    ChartComponent: LineChartWithReferenceLines,
    link: 'https://github.com/mui/mui-x/blob/v8.10.2/docs/data/charts/line-demo/LineChartWithReferenceLines.tsx',
  },
  {
    title: 'Line Chart Connect Nulls',
    ChartComponent: LineChartConnectNulls,
    link: 'https://github.com/mui/mui-x/blob/v8.10.2/docs/data/charts/line-demo/LineChartConnectNulls.tsx',
  },
  {
    title: 'Live Line Chart',
    ChartComponent: LiveLineChartNoSnap,
    link: 'https://github.com/mui/mui-x/blob/v8.10.2/docs/data/charts/line-demo/LiveLineChartNoSnap.tsx',
  },
  {
    title: 'Line with Uncertainty Area',
    ChartComponent: LineWithUncertaintyArea,
    link: 'https://github.com/mui/mui-x/blob/v8.10.2/docs/data/charts/line-demo/LineWithUncertaintyArea.tsx',
  },
  {
    title: 'Custom Line Marks',
    ChartComponent: CustomLineMarks,
    link: 'https://github.com/mui/mui-x/blob/v8.10.2/docs/data/charts/line-demo/CustomLineMarks.tsx',
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
