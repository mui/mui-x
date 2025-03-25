'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import clsx from 'clsx';
import { ANIMATION_DURATION_MS, ANIMATION_TIMING_FUNCTION } from '../internals/animation/animation';
import { cleanId } from '../internals/cleanId';
import { useChartId, useDrawingArea } from '../hooks';
import { SeriesId } from '../models/seriesType/common';

interface AppearingMaskProps {
  id: SeriesId;
  skipAnimation?: boolean;
  children: React.ReactNode;
}

export interface AppearingMaskClasses {
  /** Styles applied if the element should be animated. */
  animate: string;
}

export const appearingMaskClasses: AppearingMaskClasses = generateUtilityClasses(
  'MuiAppearingMask',
  ['animate'],
);

const AnimatedRect = styled('rect')({
  '&': {
    animationName: 'animate-width',
    animationTimingFunction: ANIMATION_TIMING_FUNCTION,
    animationDuration: 0,

    [`&.${appearingMaskClasses.animate}`]: {
      animationDuration: `${ANIMATION_DURATION_MS}ms`,
    },
  },

  '@keyframes animate-width': {
    from: { width: 0 },
  },
});

/**
 * @ignore - internal component.
 */
export function AppearingMask(props: AppearingMaskProps) {
  const drawingArea = useDrawingArea();
  const chartId = useChartId();

  const clipId = cleanId(`${chartId}-${props.id}`);
  return (
    <React.Fragment>
      <clipPath id={clipId}>
        <AnimatedRect
          className={clsx(!props.skipAnimation && appearingMaskClasses.animate)}
          x={0}
          y={0}
          width={drawingArea.left + drawingArea.width + drawingArea.right}
          height={drawingArea.top + drawingArea.height + drawingArea.bottom}
        />
      </clipPath>
      <g clipPath={`url(#${clipId})`}>{props.children}</g>
    </React.Fragment>
  );
}
