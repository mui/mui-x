'use client';
import * as React from 'react';
import { AnimatedProps, animated } from '@react-spring/web';
import { isWidthDown } from '@mui/material/Hidden/withWidth';
import type { BarElementOwnerState } from './BarElement';

export interface BarProps
  extends Omit<
      React.SVGProps<SVGRectElement>,
      'id' | 'color' | 'ref' | 'x' | 'y' | 'height' | 'width'
    >,
    AnimatedProps<{
      x?: string | number | undefined;
      y?: string | number | undefined;
      height?: string | number | undefined;
      width?: string | number | undefined;
    }> {
  x: number;
  y: number;
  width: number;
  height: number;
  ownerState: BarElementOwnerState;
}

/**
 * @ignore - internal component.
 */
export function AnimatedBarElement(props: BarProps) {
  const { ownerState, x, y, width, height, ...other } = props;

  return (
    <animated.rect
      {...other}
      // @ts-expect-error
      filter={ownerState.isHighlighted ? 'brightness(120%)' : undefined}
      opacity={ownerState.isFaded ? 0.3 : 1}
    />
  );
}

export function AnimatedBarElementV2(props: BarProps) {
  const { ownerState, x, y, width, height, ...other } = props;

  return (
    <rect
      {...other}
      x={x}
      y={y}
      width={width}
      height={height}
      // @ts-expect-error
      filter={ownerState.isHighlighted ? 'brightness(120%)' : undefined}
      opacity={ownerState.isFaded ? 0.3 : 1}
    >
      <animate
        attributeName="y"
        from={y + height}
        to={y}
        dur="0.2s"
        calcMode="spline"
        keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
      />
      <animate
        attributeName="height"
        from="0"
        to={height}
        dur="0.2s"
        calcMode="spline"
        keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
      />
    </rect>
  );
}
