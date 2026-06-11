import * as React from 'react';
import { europeanYouthTrust } from '../dataset/europeanYouthTrust';
import { usePolarGeometry } from './usePolarGeometry';

interface PreviousTrustDataProps {
  currentColor: string;
  previousColor: string;
}

/** Per-country 2013 reference line plus the up/down trend marker. */
export function PreviousTrustData({ currentColor, previousColor }: PreviousTrustDataProps) {
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
            <path d={previousLine} fill="none" stroke={previousColor} strokeWidth={2.5} />
            <g transform={`translate(${markerX} ${markerY}) rotate(${markerRotation})`}>
              <polygon points={markerPoints} fill={increased ? currentColor : previousColor} />
            </g>
          </g>
        );
      })}
    </g>
  );
}
