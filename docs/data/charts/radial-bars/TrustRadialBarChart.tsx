import * as React from 'react';
import { RadialBarChart } from '@mui/x-charts-premium/RadialBarChart';
import { useDrawingArea, useRadiusAxis, useRotationAxis } from '@mui/x-charts/hooks';
import { europeanYouthTrust } from '../dataset/europeanYouthTrust';

const CURRENT_COLOR = '#7fa8c9';
const PREVIOUS_COLOR = '#e8896b';

const euAverage =
  europeanYouthTrust.reduce((sum, d) => sum + d.trust2024, 0) /
  europeanYouthTrust.length;

const trustFormatter = (value: number | null) =>
  value == null ? '' : `${value.toFixed(1)} / 10`;

/**
 * Custom overlay drawn inside the chart's SVG (passed as `children`).
 * It reads the rotation/radius scales through chart hooks to position:
 * - the 2013 reference outline for each country,
 * - the radial country labels,
 * - the up/down trend markers,
 * - the EU average ring.
 */
function TrustDecorations() {
  const { left, top, width, height } = useDrawingArea();
  const rotationAxis = useRotationAxis();
  const radiusAxis = useRadiusAxis();

  if (!rotationAxis || !radiusAxis) {
    return null;
  }

  const cx = left + width / 2;
  const cy = top + height / 2;
  const angleScale = rotationAxis.scale as (value: string) => number | undefined;
  const bandwidth = (rotationAxis.scale as { bandwidth: () => number }).bandwidth();
  const radiusScale = radiusAxis.scale as (value: number) => number;

  // Polar (0 = up, clockwise) to local cartesian, relative to the chart center.
  const point = (radius: number, angle: number) =>
    [radius * Math.sin(angle), -radius * Math.cos(angle)] as const;

  return (
    <g transform={`translate(${cx} ${cy})`}>
      <circle
        r={radiusScale(euAverage)}
        fill="none"
        stroke="#757575"
        strokeWidth={1}
        strokeDasharray="4 4"
      />
      <text
        x={0}
        y={-radiusScale(euAverage) - 6}
        textAnchor="middle"
        transform="rotate(-20)"
        fontSize={11}
        fontStyle="italic"
        fill="#757575"
      >
        EU average 2024/25
      </text>
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
              stroke={PREVIOUS_COLOR}
              strokeWidth={2.5}
            />
            <g transform={`translate(${markerX} ${markerY}) rotate(${markerRotation})`}>
              <polygon
                points={markerPoints}
                fill={increased ? CURRENT_COLOR : PREVIOUS_COLOR}
              />
            </g>
          </g>
        );
      })}
    </g>
  );
}

const highlightScope = { highlight: 'item', fade: 'none' } as const;

export default function TrustRadialBarChart() {
  return (
    <RadialBarChart
      dataset={europeanYouthTrust}
      height={600}
      margin={{ top: 24, bottom: 24, left: 24, right: 24 }}
      hideLegend
      series={[
        {
          dataKey: 'trust2024',
          label: '2024/25 trust',
          color: CURRENT_COLOR,
          highlightScope,
          valueFormatter: trustFormatter,
        },
      ]}
      rotationAxis={[
        {
          scaleType: 'band',
          dataKey: 'country',
          startAngle: 0,
          endAngle: 354,
          categoryGapRatio: 0.25,
        },
      ]}
      radiusAxis={[
        {
          scaleType: 'linear',
          min: 0,
          max: 10,
          minRadius: 130,
          tickInterval: [6, 8, 10],
        },
      ]}
      grid={{ radius: true }}
    >
      <TrustDecorations />
    </RadialBarChart>
  );
}
