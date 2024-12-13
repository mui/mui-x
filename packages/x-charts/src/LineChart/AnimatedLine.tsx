'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { animated, useTransition } from '@react-spring/web';
import type { LineElementOwnerState } from './LineElement';
import { useStringInterpolator } from '../internals/useStringInterpolator';
import { AppearingMask } from './AppearingMask';

export interface AnimatedLineProps extends React.ComponentPropsWithoutRef<'path'> {
  ownerState: LineElementOwnerState;
  d: string;
  /**
   * If `true`, animations are skipped.
   * @default false
   */
  skipAnimation?: boolean;
}

/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [AnimatedLine API](https://mui.com/x/api/charts/animated-line/)
 */
function AnimatedLine(props: AnimatedLineProps) {
  const { d, skipAnimation, ownerState, ...other } = props;

  const stringInterpolator = useStringInterpolator(d);

  const transitionChange = useTransition([stringInterpolator], {
    from: { value: 0 },
    to: { value: 1 },
    enter: { value: 1 },
    reset: false,
    immediate: skipAnimation,
  });

  return (
    <AppearingMask skipAnimation={skipAnimation} id={`${ownerState.id}-line-clip`}>
      {transitionChange((style, interpolator) => (
        <animated.path
          d={style.value.to(interpolator)}
          stroke={ownerState.gradientId ? `url(#${ownerState.gradientId})` : ownerState.color}
          strokeWidth={2}
          strokeLinejoin="round"
          fill="none"
          filter={ownerState.isHighlighted ? 'brightness(120%)' : undefined}
          opacity={ownerState.isFaded ? 0.3 : 1}
          {...other}
        />
      ))}
    </AppearingMask>
  );
}

AnimatedLine.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  d: PropTypes.string.isRequired,
  ownerState: PropTypes.shape({
    classes: PropTypes.object,
    color: PropTypes.string.isRequired,
    gradientId: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    isFaded: PropTypes.bool.isRequired,
    isHighlighted: PropTypes.bool.isRequired,
  }).isRequired,
  /**
   * If `true`, animations are skipped.
   * @default false
   */
  skipAnimation: PropTypes.bool,
} as any;

export { AnimatedLine };
