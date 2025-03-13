'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { timer as d3Timer } from '@mui/x-charts-vendor/d3-timer';
import { interpolateString } from '@mui/x-charts-vendor/d3-interpolate';
import { AppearingMask } from './AppearingMask';
import type { LineElementOwnerState } from './LineElement';

export interface AnimatedLineProps extends React.ComponentPropsWithoutRef<'path'> {
  ownerState: LineElementOwnerState;
  d: string;
  /**
   * If `true`, animations are skipped.
   * @default false
   */
  skipAnimation?: boolean;
}

const DURATION = 200;
function useLineAnimatedProps(
  props: Pick<AnimatedLineProps, 'd' | 'skipAnimation'>,
): Pick<React.ComponentProps<'path'>, 'd'> {
  const lastValues = React.useRef({ d: props.d });
  const [d, setD] = React.useState<React.ComponentProps<'path'>['d']>(props.d);

  React.useEffect(() => {
    if (props.skipAnimation) {
      return;
    }

    const lastD = lastValues.current.d;
    const stringInterpolator = interpolateString(lastD, props.d);

    const timer = d3Timer((elapsed) => {
      if (elapsed > DURATION) {
        timer.stop();
      }

      const progress = Math.min(elapsed / DURATION, 1);

      const interpolatedD = stringInterpolator(progress);

      lastValues.current = { d: interpolatedD };

      setD(interpolatedD);
    });

    // eslint-disable-next-line consistent-return
    return () => timer.stop();
  }, [props.d, props.skipAnimation]);

  return { d };
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

  const { d: animatedD } = useLineAnimatedProps(props);

  return (
    <AppearingMask skipAnimation={skipAnimation} id={`${ownerState.id}-line-clip`}>
      <path
        d={animatedD}
        stroke={ownerState.gradientId ? `url(#${ownerState.gradientId})` : ownerState.color}
        strokeWidth={2}
        strokeLinejoin="round"
        fill="none"
        filter={ownerState.isHighlighted ? 'brightness(120%)' : undefined}
        opacity={ownerState.isFaded ? 0.3 : 1}
        {...other}
      />
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
