import * as React from 'react';
import LineChartDemo from './LineChartDemo';
import BarChartDemo from './BarChartDemo';
import PieChartDemo from './PieChartDemo';
import ScatterChartDemo from './ScatterChartDemo';
import ChartDemoNavigator from '../ChartDemoNavigator';

const advancedFeatures = [
  {
    title: 'Bar Chart',
    description: '',
  },
  {
    title: 'Line Chart',
    description: '',
  },
  {
    title: 'Pie Chart',
    description: '',
  },
  {
    title: 'Scatter Chart',
    description: '',
  },
];

export default function EssentialCharts() {
  const [activeItem, setActiveItem] = React.useState(0);

  return (
    <ChartDemoNavigator
      overline="Essential Charts"
      descriptions={advancedFeatures}
      activeItem={activeItem}
      setActiveItem={setActiveItem}
    >
      {activeItem === 0 && <BarChartDemo />}
      {activeItem === 1 && <LineChartDemo />}
      {activeItem === 2 && <PieChartDemo />}
      {activeItem === 3 && <ScatterChartDemo />}
    </ChartDemoNavigator>
  );
}
