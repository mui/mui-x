import * as React from 'react';
import { PiecewiseColorConfig } from '../../../models/colorMapping';

type ChartsPiecewiseGradientProps = {
  isReveresed?: boolean;
  gradientId: string;
  size: number;
  direction: 'x' | 'y';
  scale: (value: any) => number | undefined;
  colorMap: PiecewiseColorConfig;
};

export default function ChartsPiecewiseGradient(props: ChartsPiecewiseGradientProps) {
  const { isReveresed, gradientId, size, direction, scale, colorMap } = props;

  return (
    <linearGradient
      id={gradientId}
      x1="0"
      x2="0"
      y1="0"
      y2="0"
      {...{ [`${direction}${isReveresed ? 1 : 2}`]: `${size}px` }}
      gradientUnits="userSpaceOnUse" // Use the SVG coordinate instead of the component ones.
    >
      {colorMap.thresholds.map((threshold, index) => {
        const x = scale(threshold);

        if (x === undefined) {
          return null;
        }
        const offset = isReveresed ? 1 - x / size : x / size;

        return (
          <React.Fragment key={threshold.toString() + index}>
            <stop offset={offset} stopColor={colorMap.colors[index]} stopOpacity={1} />
            <stop offset={offset} stopColor={colorMap.colors[index + 1]} stopOpacity={1} />
          </React.Fragment>
        );
      })}
    </linearGradient>
  );
}
