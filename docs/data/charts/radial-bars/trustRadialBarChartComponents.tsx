import * as React from 'react';
import { useDrawingArea, useRotationAxis, useRadiusAxis } from '@mui/x-charts/hooks';
import {
  euAverageTrust2024,
  europeanYouthTrust,
} from '../dataset/europeanYouthTrust';

interface PreviousTrustDataProps {
  currentColor: string;
  previousColor: string;
}

/** Per-country 2013 reference line plus the up/down trend marker. */
export function PreviousTrustData({
  currentColor,
  previousColor,
}: PreviousTrustDataProps) {
  const geometry = usePolarGeometry();
  if (!geometry) {
    return null;
  }

  const { cx, cy, angleScale, bandwidth, radiusScale, point } = geometry;

  return (
    <g transform={`translate(${cx} ${cy})`}>
      {europeanYouthTrust.map((country) => {
        const start = angleScale(country.country);
        if (start == null) {
          return null;
        }
        const end = start + bandwidth;
        const mid = start + bandwidth / 2;
        const currentRadius = radiusScale(country.trust2024);
        const previousRadius = radiusScale(country.trust2013);
        const increased = country.trust2024 >= country.trust2013;

        // Arc line marking the 2013 level: two band edges at the previous
        // radius joined by a circular arc (SVG `A` command).
        const [prevStartX, prevStartY] = point(previousRadius, start);
        const [prevEndX, prevEndY] = point(previousRadius, end);
        const previousLine = `M ${prevStartX} ${prevStartY} A ${previousRadius} ${previousRadius} 0 0 1 ${prevEndX} ${prevEndY}`;

        const [markerX, markerY] = point(currentRadius + 11, mid);
        const markerRotation = (mid * 180) / Math.PI;
        const markerPoints = increased ? '0,-6 -5,3 5,3' : '0,6 -5,-3 5,-3';

        return (
          <g key={country.country}>
            <path
              d={previousLine}
              fill="none"
              stroke={previousColor}
              strokeWidth={2.5}
            />
            <g
              transform={`translate(${markerX} ${markerY}) rotate(${markerRotation})`}
            >
              <polygon
                points={markerPoints}
                fill={increased ? currentColor : previousColor}
              />
            </g>
          </g>
        );
      })}
    </g>
  );
}

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
      <circle
        r={radius}
        fill="none"
        stroke="#757575"
        strokeWidth={1}
        strokeDasharray="4 4"
      />
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

export interface PolarGeometry {
  cx: number;
  cy: number;
  angleScale: (value: string) => number | undefined;
  bandwidth: number;
  radiusScale: (value: number) => number;
  // Polar (0 = up, clockwise) to local cartesian, relative to the center.
  point: (radius: number, angle: number) => readonly [number, number];
}

/**
 * Reads the polar scales through chart hooks and exposes helpers to place
 * custom SVG relative to the chart center. Returns `null` before the scales
 * are ready.
 */
export function usePolarGeometry(): PolarGeometry | null {
  const { left, top, width, height } = useDrawingArea();
  const rotationAxis = useRotationAxis();
  const radiusAxis = useRadiusAxis();

  if (!rotationAxis || !radiusAxis) {
    return null;
  }

  return {
    cx: left + width / 2,
    cy: top + height / 2,
    angleScale: rotationAxis.scale as (value: string) => number | undefined,
    bandwidth: (rotationAxis.scale as { bandwidth: () => number }).bandwidth(),
    radiusScale: radiusAxis.scale as (value: number) => number,
    point: (radius, angle) => [radius * Math.sin(angle), -radius * Math.cos(angle)],
  };
}
