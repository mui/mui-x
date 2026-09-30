import * as React from 'react';
import { getRingPath } from '../../internals/getRingPath';
import type { RadarGridStripeRenderProps } from './RadarGrid.types';

/**
 * @ignore - internal component.
 */
export function CircularRadarStripes(props: RadarGridStripeRenderProps) {
  const { center, divisions, radius, stripeColor, classes } = props;

  const divisionRadius = Array.from(
    { length: divisions },
    (_, index) => (radius * (index + 1)) / divisions,
  );
  return (
    <React.Fragment>
      {divisionRadius.map((r, index) => {
        const smallerRadius = divisionRadius[index - 1] ?? 0;
        return (
          <path
            key={r}
            d={getRingPath(center, r, smallerRadius)}
            fillRule="evenodd"
            fill={stripeColor?.(index) ?? 'none'}
            fillOpacity={0.1}
            className={classes?.gridStripe}
          />
        );
      })}
    </React.Fragment>
  );
}
