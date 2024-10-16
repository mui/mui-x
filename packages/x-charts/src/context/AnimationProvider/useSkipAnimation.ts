'use client';
import * as React from 'react';
import { AnimationContext } from './AnimationContext';

/**
 * A hook to get if chart animations should be skipped.
 *
 * @returns {boolean|undefined} whether to skip animations
 */
export function useSkipAnimation(skipAnimation?: boolean): boolean | undefined {
  const { isInitialized, data } = React.useContext(AnimationContext);

  if (!isInitialized) {
    throw new Error(
      [
        'MUI X: Could not find the animation ref context.',
        'It looks like you rendered your component outside of a ChartsContainer parent component.',
      ].join('\n'),
    );
  }

  return skipAnimation || data.skipAnimation;
}
