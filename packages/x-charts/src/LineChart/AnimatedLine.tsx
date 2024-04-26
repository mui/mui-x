import * as React from 'react';
import PropTypes from 'prop-types';
import { animated, useSpring } from '@react-spring/web';
import { color as d3Color } from 'd3-color';
import useLazyRef from '@mui/utils/useLazyRef';
import { styled } from '@mui/material/styles';
import { useAnimatedPath } from '../internals/useAnimatedPath';
import type { LineElementOwnerState } from './LineElement';

const PATH_SAMPLING_INTERVAL = 3; // pixels

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
  const measurements = useLazyRef(measurePath, d).current;
  const ref = React.useRef<SVGPathElement>(null);

  const path = useAnimatedPath(d, skipAnimation);

  useSpring({
    from: { length: 0 },
    to: { length: measurements.totalLength },
    reset: false,
    immediate: skipAnimation || measurements.totalLength === 0,
    onChange: ({ value: { length } }) => {
      if (ref.current && measurements.points.length > 1) {
        const start = measurements.points[0];
        let partialPath = `M${start.x},${start.y} `;
        for (let i = 1; i < length / PATH_SAMPLING_INTERVAL; i += 1) {
          const p = measurements.points[i];
          partialPath += `L${p.x},${p.y} `;
        }

        ref.current.setAttributeNS(null, 'd', partialPath);
      }
    },
  });

  return (
    <g>
      <LineElementPath ref={ref} {...other} ownerState={ownerState} d={path} />
    </g>
  );
}

const element =
  typeof document !== 'undefined'
    ? document.createElementNS('http://www.w3.org/2000/svg', 'path')
    : undefined;
function measurePath(path?: string) {
  if (!element) {
    return { totalLength: 0, points: [] };
  }
  element.setAttributeNS(null, 'd', path ?? '');
  const totalLength = element.getTotalLength();
  const points = Array.from({ length: Math.ceil(totalLength / PATH_SAMPLING_INTERVAL) }).map(
    (_, i) => element.getPointAtLength(i * PATH_SAMPLING_INTERVAL),
  );
  return { totalLength, points };
}

AnimatedLine.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
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
