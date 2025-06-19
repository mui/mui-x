import * as React from 'react';
import HeatmapDemo from './HeatmapDemo';
import RadarDemo from './RadarDemo';
import FunnelDemo from './FunnelDemo';
import ChartDemoNavigator from '../ChartDemoNavigator';

const advancedCharts = [
  {
    title: 'Radar',
    description: 'Compare elements on multiple metrics',
  },
  {
    title: 'Heatmap',
    description: 'Offers an intuitive and efficient way to reorganize the tree structure.',
    iconLink: '/static/x/pro.svg',
  },
  {
    title: 'Funnel',
    description: 'Improves performance by loading children on demand, especially for large trees.',
    iconLink: '/static/x/pro.svg',
  },
];

export default function AdvancedCharts() {
  const [activeItem, setActiveItem] = React.useState(0);

  return (
    <ChartDemoNavigator
      descriptions={advancedCharts}
      activeItem={activeItem}
      setActiveItem={setActiveItem}
    >
      {activeItem === 0 && <RadarDemo />}
      {activeItem === 1 && <HeatmapDemo />}
      {activeItem === 2 && <FunnelDemo />}
    </ChartDemoNavigator>
  );
}
