import * as React from 'react';
import MultiAxesDemo from './MultiAxesDemo';
import ZoomAndPanDemo from './ZoomAndPanDemo';
import ExportDemo from './ExportDemo';
import ChartDemoNavigator from '../ChartDemoNavigator';

const advancedFeatures = [
  {
    title: 'Multi axes and series',
    description:
      'Support multiple axes and chart types to pick the visualization the matches your need.',
  },
  {
    title: 'Zoom & Pan',
    description: 'BUilt-in zoom features to explore the details of your chart.',
    iconLink: '/static/x/pro.svg',
  },
  {
    title: 'Export',
    description: 'Save your charts in PDF, PNG, or JPEG format to share them outside of the web.',
    iconLink: '/static/x/pro.svg',
  },
];

export default function AdvancedFeatures() {
  const [activeItem, setActiveItem] = React.useState(0);

  return (
    <ChartDemoNavigator
      overline="Advanced Features"
      descriptions={advancedFeatures}
      activeItem={activeItem}
      setActiveItem={setActiveItem}
    >
      {activeItem === 0 && <MultiAxesDemo />}
      {activeItem === 1 && <ZoomAndPanDemo />}
      {activeItem === 2 && <ExportDemo />}
    </ChartDemoNavigator>
  );
}
