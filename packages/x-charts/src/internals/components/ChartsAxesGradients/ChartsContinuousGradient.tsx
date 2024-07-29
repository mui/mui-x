import * as React from 'react';
import { interpolateDate, interpolateNumber } from '@mui/x-charts-vendor/d3-interpolate';
import { ContinuousColorConfig } from '../../../models/colorMapping';

const PX_PRECISION = 10;

type ChartsContinuousGradientProps = {
  isReversed?: boolean;
  gradientId: string;
  size: number;
  direction: 'x' | 'y';
  scale: (value: any) => number | undefined;
  colorMap: ContinuousColorConfig;
  colorScale: (value: any) => string | null;
  /**
   * Defines the coordinate base to use:
   * - 'userSpaceOnUse': uses the coordinate of the SVG (values in px).
   * - 'objectBoundingBox': uses the coordinate ot the object on which gradient is applied (values from 0 to 1).
   */
  gradientUnits?: 'objectBoundingBox' | 'userSpaceOnUse';
};

export default function ChartsContinuousGradient(props: ChartsContinuousGradientProps) {
  const { gradientUnits, isReversed, gradientId, size, direction, scale, colorScale, colorMap } =
    props;

  const extremValues = [colorMap.min ?? 0, colorMap.max ?? 100] as [number, number] | [Date, Date];
  const extremPositions = extremValues.map(scale).filter((p): p is number => p !== undefined);

  if (extremPositions.length !== 2) {
    return null;
  }

  const interpolator =
    typeof extremValues[0] === 'number'
      ? interpolateNumber(extremValues[0], extremValues[1])
      : interpolateDate(extremValues[0], extremValues[1] as Date);
  const numberOfPoints = Math.round(
    (Math.max(...extremPositions) - Math.min(...extremPositions)) / PX_PRECISION,
  );

  const keyPrefix = `${extremValues[0]}-${extremValues[1]}-`;
  return (
    <linearGradient
      id={gradientId}
      x1="0"
      x2="0"
      y1="0"
      y2="0"
      {...{
        [`${direction}${isReversed ? 1 : 2}`]:
          gradientUnits === 'objectBoundingBox' ? 1 : `${size}px`,
      }}
      gradientUnits={gradientUnits ?? 'userSpaceOnUse'} // Use the SVG coordinate instead of the component ones.
    >
      {Array.from({ length: numberOfPoints + 1 }, (_, index) => {
        const value = interpolator(index / numberOfPoints);
        if (value === undefined) {
          return null;
        }
        const x = scale(value);
        if (x === undefined) {
          return null;
        }
        const offset = isReversed ? 1 - x / size : x / size;
        const color = colorScale(value);

        if (color === null) {
          return null;
        }
        return <stop key={keyPrefix + index} offset={offset} stopColor={color} stopOpacity={1} />;
      })}
    </linearGradient>
  );
}
