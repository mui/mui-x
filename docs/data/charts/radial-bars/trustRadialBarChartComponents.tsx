import * as React from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useDrawingArea, useRotationAxis, useRadiusAxis } from '@mui/x-charts/hooks';
import { ChartsTooltipContainer, useItemTooltip } from '@mui/x-charts/ChartsTooltip';
import {
  euAverageTrust2025,
  europeanYouthTrust,
} from '../dataset/europeanYouthTrust';

interface PreviousTrustDataProps {
  currentColor: string;
  previousColor: string;
}

function TrustTooltipContent() {
  const item = useItemTooltip<'radialBar'>();
  if (!item) {
    return null;
  }

  const country = europeanYouthTrust[item.identifier.dataIndex];
  if (!country) {
    return null;
  }

  const difference = country.trust2025 - country.trust2013;
  const increased = difference >= 0;

  return (
    <Paper
      elevation={0}
      sx={{ m: 1, p: 1.5, border: 'solid', borderWidth: 2, borderColor: 'divider' }}
    >
      <Stack spacing={1}>
        <Typography sx={{ fontWeight: 'medium' }}>{country.country}</Typography>
        <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 3 }}>
          <Typography variant="body2" color="text.secondary">
            2025
          </Typography>
          <Typography variant="body2">
            {country.trust2025.toFixed(1)} / 10
          </Typography>
        </Stack>
        <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 3 }}>
          <Typography variant="body2" color="text.secondary">
            2013
          </Typography>
          <Typography variant="body2">
            {country.trust2013.toFixed(1)} / 10
          </Typography>
        </Stack>
        <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Change
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 'medium',
              color: increased ? 'success.main' : 'error.main',
            }}
          >
            {increased ? '▲' : '▼'} {increased ? '+' : ''}
            {difference.toFixed(1)}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}

/** Item tooltip showing the 2013 and 2025 values and their difference. */
export function TrustTooltip() {
  return (
    <ChartsTooltipContainer trigger="item">
      <TrustTooltipContent />
    </ChartsTooltipContainer>
  );
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
        const currentRadius = radiusScale(country.trust2025);
        const previousRadius = radiusScale(country.trust2013);
        const increased = country.trust2025 >= country.trust2013;

        // Arc line marking the 2013 level: two band edges at the previous
        // radius joined by a circular arc (SVG `A` command).
        const [prevStartX, prevStartY] = point(previousRadius, start);
        const [prevEndX, prevEndY] = point(previousRadius, end);
        const previousLine = `M ${prevStartX} ${prevStartY} A ${previousRadius} ${previousRadius} 0 0 1 ${prevEndX} ${prevEndY}`;

        // Increase arrow sits past the blue (current) bar, decrease arrow past
        // the red (previous) line, both at a static distance.
        const markerGap = 11;
        const markerRadius = increased
          ? currentRadius + markerGap
          : previousRadius + markerGap;
        const [markerX, markerY] = point(markerRadius, mid);
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

/** Dashed ring at the EU average of the 2025 values. */
export function EuAverageRing() {
  const geometry = usePolarGeometry();
  if (!geometry) {
    return null;
  }

  const { cx, cy, radiusScale } = geometry;
  const radius = radiusScale(euAverageTrust2025);

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
        EU average 2025
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
