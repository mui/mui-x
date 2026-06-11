import * as React from 'react';
import { euAverageTrust2024 } from '../dataset/europeanYouthTrust';
import { usePolarGeometry } from './usePolarGeometry';

/** Dashed ring at the EU average of the 2024/25 values. */
export function EuAverageRing() {
  const geometry = usePolarGeometry();
  if (!geometry) {
    return null;
  }

  const { cx, cy, radiusScale } = geometry;
  const radius = radiusScale(euAverageTrust2024);

  return (
    <g transform={`translate(${cx} ${cy})`}>
      <circle r={radius} fill="none" stroke="#757575" strokeWidth={1} strokeDasharray="4 4" />
      <text
        x={0}
        y={-radius - 6}
        textAnchor="middle"
        transform="rotate(-20)"
        fontSize={11}
        fontStyle="italic"
        fill="#757575"
      >
        EU average 2024/25
      </text>
    </g>
  );
}
