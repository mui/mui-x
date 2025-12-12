'use client';
import * as React from 'react';
import { type BarProps } from '@mui/x-charts/BarChart';
import { useAnimateRangeBar } from '../../hooks/animation/useAnimateRangeBar';

export interface AnimatedRangeBarElementProps extends BarProps {}

export function AnimatedRangeBarElement(props: AnimatedRangeBarElementProps) {
  const { ownerState, skipAnimation, id, dataIndex, xOrigin, yOrigin, ...other } = props;

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
