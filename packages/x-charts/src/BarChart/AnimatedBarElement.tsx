'use client';
import * as React from 'react';
import type { BarElementOwnerState } from './BarElement';

export interface BarProps extends Omit<React.SVGProps<SVGRectElement>, 'id' | 'color' | 'ref'> {
  ownerState?: BarElementOwnerState;
}

/**
 * @ignore - internal component.
 */
export function AnimatedBarElement(props: BarProps) {
  const { ownerState, ...other } = props;

  return (
    <rect
      {...other}
      filter={ownerState?.isHighlighted ? 'brightness(120%)' : undefined}
      opacity={ownerState?.isFaded ? 0.3 : 1}
    />
  );
}
