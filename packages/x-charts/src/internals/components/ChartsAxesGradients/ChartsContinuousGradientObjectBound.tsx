import * as React from 'react';
import { interpolateDate, interpolateNumber } from '@mui/x-charts-vendor/d3-interpolate';
import { ContinuousColorConfig } from '../../../models/colorMapping';

const PX_PRECISION = 10;

type ChartsContinuousGradientObjectBoundProps = {
  isReversed?: boolean;
  gradientId: string;
  colorMap: ContinuousColorConfig;
  colorScale: (value: any) => string | null;
};

const getDirection = (isReversed?: boolean): Record<'x1' | 'x2' | 'y1' | 'y2', '0' | '1'> => {
  if (isReversed) {
    return { x1: '1', x2: '0', y1: '0', y2: '0' };
  }
  return { x1: '0', x2: '1', y1: '0', y2: '0' };
};

/**
 * Generates gradients to be used in tooltips and legends.
 */
export default function ChartsContinuousGradientObjectBound(
  props: ChartsContinuousGradientObjectBoundProps,
) {
  const { isReversed, gradientId, colorScale, colorMap } = props;

  const extremumValues = [colorMap.min ?? 0, colorMap.max ?? 100] as
    | [number, number]
    | [Date, Date];

  const interpolator =
    typeof extremumValues[0] === 'number'
      ? interpolateNumber(extremumValues[0], extremumValues[1])
      : interpolateDate(extremumValues[0], extremumValues[1] as Date);
  const numberOfPoints = PX_PRECISION;

  const keyPrefix = `${extremumValues[0]}-${extremumValues[1]}-`;
  return (
    <linearGradient
      id={gradientId}
      {...getDirection(isReversed)}
      gradientUnits={'objectBoundingBox'} // Use the SVG coordinate instead of the component ones.
    >
      {Array.from({ length: numberOfPoints + 1 }, (_, index) => {
        const offset = index / numberOfPoints;
        const value = interpolator(offset);
        if (value === undefined) {
          return null;
        }

        const color = colorScale(value);

        if (color === null) {
          return null;
        }
        return <stop key={keyPrefix + index} offset={offset} stopColor={color} stopOpacity={1} />;
      })}
    </linearGradient>
  );
}
