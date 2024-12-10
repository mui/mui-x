'use client';
import * as React from 'react';
import { AnimatedProps, animated } from '@react-spring/web';
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
  ownerState: BarElementOwnerState;
}

/**
 * @ignore - internal component.
 */
export function AnimatedBarElement(props: BarProps) {
  const { ownerState, ...other } = props;

  return (
    <animated.rect
      {...other}
      // @ts-expect-error
      filter={ownerState.isHighlighted ? 'brightness(120%)' : undefined}
      opacity={ownerState.isFaded ? 0.3 : 1}
    />
  );
}
