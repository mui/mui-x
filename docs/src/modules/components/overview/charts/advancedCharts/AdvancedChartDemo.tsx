import * as React from 'react';
import HeatmapDemo from './HeatmapDemo';
import RadarDemo from './RadarDemo';
import FunnelDemo from './FunnelDemo';
import ChartDemoNavigator from '../ChartDemoNavigator';

const advancedCharts = [
  {
    title: 'Radar',
    description: 'Compare multiple variables across different categories.',
  },
  {
    title: 'Heatmap',
    description: 'Visualize data density and distribution.',
    iconLink: '/static/x/pro.svg',
  },
  {
    title: 'Funnel',
    description: 'Display the sequential stages of a process.',
    iconLink: '/static/x/pro.svg',
  },
];

export default function AdvancedCharts() {
  const [activeItem, setActiveItem] = React.useState(0);

  return (
    <ChartDemoNavigator
      overline="Advanced Charts"
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
