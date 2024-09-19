'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { animated, useTransition } from '@react-spring/web';
import { color as d3Color } from '@mui/x-charts-vendor/d3-color';
import { styled } from '@mui/material/styles';
import { cleanId } from '../internals/cleanId';
import type { LineElementOwnerState } from './LineElement';
import { useChartId } from '../hooks/useChartId';
import { useDrawingArea } from '../hooks/useDrawingArea';
import { useStringInterpolator } from '../internals/useStringInterpolator';

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
  const drawingArea = useDrawingArea();
  const chartId = useChartId();

  const stringInterpolator = useStringInterpolator(d);

  const transitionAppear = useTransition<typeof drawingArea, { animatedWidth: number }>(
    [drawingArea],
    {
      from: (v) => ({ animatedWidth: v.left }),
      enter: (v) => ({ animatedWidth: v.width + v.left + v.right }),
      leave: (v) => ({ animatedWidth: v.width + v.left + v.right }),
      reset: false,
      immediate: skipAnimation,
    },
  );

  const transitionChange = useTransition([stringInterpolator], {
    from: { value: 0 },
    to: { value: 1 },
    enter: { value: 1 },
    reset: false,
    immediate: skipAnimation,
  });

  const clipId = cleanId(`${chartId}-${ownerState.id}-line-clip`);
  return (
    <React.Fragment>
      <clipPath id={clipId}>
        {transitionAppear((style) => (
          <animated.rect
            x={0}
            y={0}
            width={style.animatedWidth}
            height={drawingArea.top + drawingArea.height + drawingArea.bottom}
          />
        ))}
      </clipPath>
      <g clipPath={`url(#${clipId})`}>
        {transitionChange((style, interpolator) => (
          <LineElementPath {...other} ownerState={ownerState} d={style.value.to(interpolator)} />
        ))}
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
