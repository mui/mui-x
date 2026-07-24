import * as React from 'react';
import HeatmapDemo from './HeatmapDemo';
import RadarDemo from './RadarDemo';
import FunnelDemo from './FunnelDemo';
import PyramidDemo from './PyramidDemo';
import SankeyDemo from './SankeyDemo';
import RangeBarDemo from './RangeBarDemo';
import ChartDemoNavigator from '../ChartDemoNavigator';

const advancedCharts = [
  {
    title: 'Radar',
  },
  {
    title: 'Heatmap',
    iconLink: '/static/x/pro.svg',
  },
  {
    title: 'Funnel',
    iconLink: '/static/x/pro.svg',
  },
  {
    title: 'Pyramid',
    iconLink: '/static/x/pro.svg',
  },
  {
    title: 'Sankey',
    iconLink: '/static/x/pro.svg',
  },
  {
    title: 'Range Bar',
    iconLink: '/static/x/premium.svg',
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
      {activeItem === 3 && <PyramidDemo />}
      {activeItem === 4 && <SankeyDemo />}
      {activeItem === 5 && <RangeBarDemo />}
    </ChartDemoNavigator>
  );
}
