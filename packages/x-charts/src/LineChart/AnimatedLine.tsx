import * as React from 'react';
import PropTypes from 'prop-types';
import { animated, useSpring } from '@react-spring/web';
import { color as d3Color } from '@mui/x-charts-vendor/d3-color';
import { styled } from '@mui/material/styles';
import { useAnimatedPath } from '../internals/useAnimatedPath';
import { cleanId } from '../internals/cleanId';
import type { LineElementOwnerState } from './LineElement';
import { useChartId } from '../hooks/useChartId';
import { useDrawingArea } from '../hooks/useDrawingArea';

export const LineElementPath = styled(animated.path, {
  name: 'MuiLineElement',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{ ownerState: LineElementOwnerState }>(({ ownerState }) => ({
  strokeWidth: 2,
  strokeLinejoin: 'round',
  fill: 'none',
  stroke:
    (ownerState.gradientId && `url(#${ownerState.gradientId})`) ||
    (ownerState.isHighlighted && d3Color(ownerState.color)!.brighter(0.5).formatHex()) ||
    ownerState.color,
  transition: 'opacity 0.2s ease-in, stroke 0.2s ease-in',
  opacity: ownerState.isFaded ? 0.3 : 1,
}));

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
  const { left, top, bottom, width, height, right } = useDrawingArea();
  const chartId = useChartId();

  const path = useAnimatedPath(d, skipAnimation);

  const { animatedWidth } = useSpring({
    from: { animatedWidth: left },
    to: { animatedWidth: width + left + right },
    reset: false,
    immediate: skipAnimation,
  });

  const clipId = cleanId(`${chartId}-${ownerState.id}-line-clip`);
  return (
    <React.Fragment>
      <clipPath id={clipId}>
        <animated.rect x={0} y={0} width={animatedWidth} height={top + height + bottom} />
      </clipPath>
      <g clipPath={`url(#${clipId})`}>
        <LineElementPath {...other} ownerState={ownerState} d={path} />
      </g>
    </React.Fragment>
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
