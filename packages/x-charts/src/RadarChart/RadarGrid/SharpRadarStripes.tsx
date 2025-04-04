import * as React from 'react';
import { RadarGridStripeRenderProps } from './RadarGrid.types';

const getPath = (
  corners: RadarGridStripeRenderProps['corners'],
  center: RadarGridStripeRenderProps['center'],
  outerRatio: number,
  innerRatio: number,
) =>
  [
    'M',
    [...corners, corners[0]]
      .map(
        ({ x, y }) =>
          `${center.x * (1 - outerRatio) + outerRatio * x} ${center.y * (1 - outerRatio) + outerRatio * y}`,
      )
      .join(' L '),
    'L',
    [...corners, corners[0]]
      .reverse()
      .map(
        ({ x, y }) =>
          `${center.x * (1 - innerRatio) + innerRatio * x} ${center.y * (1 - innerRatio) + innerRatio * y}`,
      )
      .join(' L '),
    'Z',
  ].join(' ');

/**
 * @ignore - internal component.
 */
export function SharpRadarStripes(props: RadarGridStripeRenderProps) {
  const { center, corners, divisions, getStripeColor, classes } = props;

  const divisionRatio = Array.from({ length: divisions }, (_, index) => (index + 1) / divisions);

  return (
    <React.Fragment>
      {divisionRatio.map((ratio, index) => {
        const smallerRatio = divisionRatio[index - 1] ?? 0;
        return (
          <path
            key={ratio}
            d={getPath(corners, center, ratio, smallerRatio)}
            stroke="none"
            fill={getStripeColor?.(index) ?? 'none'}
            fillOpacity={0.1}
            className={classes?.stripe}
          />
        );
      })}
    </React.Fragment>
  );
}
