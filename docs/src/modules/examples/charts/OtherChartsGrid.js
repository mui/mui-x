import * as React from 'react';
import BasicGauges from 'docsx/data/charts/gauge/BasicGauges';
import ArcDesign from 'docsx/data/charts/gauge/ArcDesign';
import CompositionExample from 'docsx/data/charts/gauge/CompositionExample';
import BasicSparkLine from 'docsx/data/charts/sparkline/BasicSparkLine';
import AreaSparkLine from 'docsx/data/charts/sparkline/AreaSparkLine';
import { ChartThumbnailCard, ChartThumbnailGridWrapper } from './ChartExampleThumbnailGrid';

const chartData = [
  {
    title: 'Basic Gauges',
    ChartComponent: BasicGauges,
    link: '/x/react-charts/gauge/#BasicGauges',
  },
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
    title: 'Basic Sparkline',
    ChartComponent: BasicSparkLine,
    link: '/x/react-charts/sparkline/#BasicSparkLine',
  },
  {
    title: 'Area Sparkline',
    ChartComponent: AreaSparkLine,
    link: '/x/react-charts/sparkline/#AreaSparkLine',
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
