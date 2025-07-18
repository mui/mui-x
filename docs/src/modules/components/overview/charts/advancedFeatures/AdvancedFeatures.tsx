import * as React from 'react';
import MultiAxesDemo from './MultiAxesDemo';
import ZoomAndPanDemo from './ZoomAndPanDemo';
import ExportDemo from './ExportDemo';
import ChartDemoNavigator from '../ChartDemoNavigator';

const advancedFeatures = [
  {
    title: 'Multiple axes and series',
    description: 'Layer multiple chart types and axes to meet complex visualization needs.',
  },
  {
    title: 'Zoom and pan',
    description: 'Explore the details of the data with zooming and panning.',
    iconLink: '/static/x/pro.svg',
  },
  {
    title: 'Export',
    description: 'Save your charts in PDF, PNG, or JPEG formats to share them anywhere.',
    iconLink: '/static/x/pro.svg',
  },
];

export default function AdvancedFeatures() {
  const [activeItem, setActiveItem] = React.useState(0);

  return (
    <ChartDemoNavigator
      overline="Advanced features"
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
