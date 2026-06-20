import * as React from 'react';
import { usePolarGeometry } from '@mui/x-charts/hooks';
import { RadialBarChart, RadialBarPlot } from '@mui/x-charts-premium/RadialBarChart';
import { ChartsRadiusAxis } from '@mui/x-charts/ChartsRadiusAxis';
import { ChartsRotationAxis } from '@mui/x-charts/ChartsRotationAxis';

const trustData = [
  { country: 'Denmark', trust: 65 },
  { country: 'Finland', trust: 62 },
  { country: 'Netherlands', trust: 60 },
  { country: 'Sweden', trust: 58 },
  { country: 'Norway', trust: 61 },
];

/**
 * Custom overlay using usePolarGeometry hook
 */
function PolarGeometryOverlay() {
  const geometry = usePolarGeometry();

  if (!geometry) {
    return null;
  }

  // Draw a reference ring at value 50
  const radius = geometry.radiusScale(50);
  const [x, y] = geometry.point(50, Math.PI / 4);

  return (
    <React.Fragment>
      {/* Reference ring */}
      <circle
        cx={geometry.cx}
        cy={geometry.cy}
        r={radius}
        fill="none"
        stroke="#999"
        strokeDasharray="4"
        opacity={0.5}
        strokeWidth={1}
      />

      {/* Custom marker at a specific angle and radius */}
      <circle
        cx={geometry.cx + x}
        cy={geometry.cy + y}
        r={4}
        fill="red"
        opacity={0.8}
      />
    </React.Fragment>
  );
}

/**
 * Simple demo: Radial bar chart with custom geometry overlay
 */
export default function UsePolarGeometry() {
  return (
    <RadialBarChart
      dataset={trustData}
      series={[{ dataKey: 'trust' }]}
      rotationAxis={[{ dataKey: 'country', scaleType: 'band' }]}
      radiusAxis={[{ scaleType: 'linear' }]}
      margin={{ top: 50, bottom: 50, left: 50, right: 50 }}
      width={400}
      height={400}
    >
      <ChartsRadiusAxis />
      <ChartsRotationAxis />
      <RadialBarPlot />
      <PolarGeometryOverlay />
    </RadialBarChart>
  );
}
