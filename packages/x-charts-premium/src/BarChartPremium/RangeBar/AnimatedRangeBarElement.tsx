'use client';
import * as React from 'react';
import { type BarProps } from '@mui/x-charts/BarChart';
import { useAnimateRangeBar } from '../../hooks/animation/useAnimateRangeBar';

export interface AnimatedRangeBarElementProps extends BarProps {
  /**
   * If true, the bar is hidden and will animate to a collapsed state.
   */
  hidden?: boolean;
}

export function AnimatedRangeBarElement(props: AnimatedRangeBarElementProps) {
  const { ownerState, skipAnimation, seriesId, dataIndex, xOrigin, yOrigin, hidden, ...other } =
    props;

  const animatedProps = useAnimateRangeBar(props);

  return (
    <rect
      {...other}
      filter={ownerState.isHighlighted ? 'brightness(120%)' : undefined}
      opacity={ownerState.isFaded ? 0.3 : 1}
      data-highlighted={ownerState.isHighlighted || undefined}
      data-faded={ownerState.isFaded || undefined}
      {...animatedProps}
    />
  );
}
