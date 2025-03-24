'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { ANIMATION_DURATION_MS, ANIMATION_TIMING_FUNCTION } from '../internals/animation/animation';
import { barElementClasses, BarElementOwnerState } from './barElementClasses';

export interface BarProps extends Omit<React.SVGProps<SVGRectElement>, 'id' | 'color' | 'ref'> {
  ownerState: BarElementOwnerState;
}

const AnimatedRect = styled('rect')({
  [`&.${barElementClasses.root}.${barElementClasses.animate}`]: {
    transitionDuration: `${ANIMATION_DURATION_MS}ms`,
    transitionTimingFunction: ANIMATION_TIMING_FUNCTION,

    [`&.${barElementClasses.vertical}`]: {
      transitionProperty: 'x, width, y, height',
    },

    [`&.${barElementClasses.horizontal}`]: {
      transitionProperty: 'x, width',
    },
  },
});

export function AnimatedBarElement(props: BarProps) {
  const { ownerState, ...other } = props;

  return (
    <AnimatedRect
      {...other}
      filter={ownerState.isHighlighted ? 'brightness(120%)' : undefined}
      opacity={ownerState.isFaded ? 0.3 : 1}
    />
  );
}
