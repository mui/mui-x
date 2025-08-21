import * as React from 'react';
import { ChartThumbnailCard, ChartThumbnailGridWrapper } from './ChartExampleThumbnailGrid';
import BasicGauges from '../data/charts/gauge/BasicGauges';
import ArcDesign from '../data/charts/gauge/ArcDesign';
import CompositionExample from '../data/charts/gauge/CompositionExample';
import BasicSparkLine from '../data/charts/sparkline/BasicSparkLine';
import AreaSparkLine from '../data/charts/sparkline/AreaSparkLine';

const chartData = [
  {
    title: 'Basic Gauges',
    ChartComponent: BasicGauges,
    link: 'https://github.com/mui/mui-x/blob/v8.10.2/docs/data/charts/gauge/BasicGauges.tsx',
  },
  {
    title: 'Arc Design',
    ChartComponent: ArcDesign,
    link: 'https://github.com/mui/mui-x/blob/v8.10.2/docs/data/charts/gauge/ArcDesign.tsx',
  },
  {
    title: 'Customized Gauge with Pointer',
    ChartComponent: CompositionExample,
    link: 'https://github.com/mui/mui-x/blob/v8.10.2/docs/data/charts/gauge/CompositionExample.tsx',
  },
  {
    title: 'Basic Sparkline',
    ChartComponent: BasicSparkLine,
    link: 'https://github.com/mui/mui-x/blob/v8.10.2/docs/data/charts/sparkline/BasicSparkLine.tsx',
  },
  {
    title: 'Area Sparkline',
    ChartComponent: AreaSparkLine,
    link: 'https://github.com/mui/mui-x/blob/v8.10.2/docs/data/charts/sparkline/AreaSparkLine.tsx',
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
