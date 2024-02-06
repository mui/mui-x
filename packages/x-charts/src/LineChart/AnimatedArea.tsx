import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { color as d3Color } from 'd3-color';
import { animated, useSpring } from '@react-spring/web';
import { useAnimatedPath } from '../internals/useAnimatedPath';
import { DrawingContext } from '../context/DrawingProvider';
import { cleanId } from '../internals/utils';
import type { AreaElementOwnerState } from './AreaElement';

export const AreaElementPath = styled(animated.path, {
  name: 'MuiAreaElement',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{ ownerState: AreaElementOwnerState }>(({ ownerState }) => ({
  stroke: 'none',
  fill: ownerState.isHighlighted
    ? d3Color(ownerState.color)!.brighter(1).formatHex()
    : d3Color(ownerState.color)!.brighter(0.5).formatHex(),
  transition: 'opacity 0.2s ease-in, fill 0.2s ease-in',
  opacity: ownerState.isFaded ? 0.3 : 1,
}));

export interface AnimatedAreaProps extends React.ComponentPropsWithoutRef<'path'> {
  ownerState: AreaElementOwnerState;
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
 * - [Areas demonstration](https://mui.com/x/react-charts/areas-demo/)
 *
 * API:
 *
 * - [AreaElement API](https://mui.com/x/api/charts/animated-area/)
 */
function AnimatedArea(props: AnimatedAreaProps) {
  const { d, skipAnimation, ownerState, ...other } = props;
  const { left, top, right, bottom, width, height, chartId } = React.useContext(DrawingContext);

  const path = useAnimatedPath(d!, skipAnimation);

  const { animatedWidth } = useSpring({
    from: { animatedWidth: left },
    to: { animatedWidth: width + left + right },
    reset: false,
    immediate: skipAnimation,
  });

  const clipId = cleanId(`${chartId}-${ownerState.id}-area-clip`);
  return (
    <React.Fragment>
      <clipPath id={clipId}>
        <animated.rect x={0} y={0} width={animatedWidth} height={top + height + bottom} />
      </clipPath>
      <g clipPath={`url(#${clipId})`}>
        <AreaElementPath {...other} ownerState={ownerState} d={path} />
      </g>
    </React.Fragment>
  );
}

AnimatedArea.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  d: PropTypes.string.isRequired,
  ownerState: PropTypes.shape({
    classes: PropTypes.object,
    color: PropTypes.string.isRequired,
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

export { AnimatedArea };
