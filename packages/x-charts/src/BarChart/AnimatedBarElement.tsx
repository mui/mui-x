'use client';
import * as React from 'react';
import { BarElementOwnerState } from './barElementClasses';
import { useAnimateBar } from '../hooks/animation/useAnimateBar';

export interface BarProps extends Omit<React.SVGProps<SVGRectElement>, 'id' | 'color' | 'ref'> {
  ownerState: BarElementOwnerState;
  x: number;
  y: number;
  width: number;
  height: number;
  layout: 'horizontal' | 'vertical';
  skipAnimation: boolean;
}

export function AnimatedBarElement(props: BarProps) {
  const { ownerState, ...other } = props;

  const animatedProps = useAnimateBar(props);

  return (
    <rect
      {...other}
      filter={ownerState.isHighlighted ? 'brightness(120%)' : undefined}
      opacity={ownerState.isFaded ? 0.3 : 1}
      {...animatedProps}
    />
  );
}
