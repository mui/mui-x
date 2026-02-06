'use client';
import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { type ChartPlugin } from '../../models';
import type { UseChartAnimationSignature } from './useChartAnimation.types';

export const useChartAnimation: ChartPlugin<UseChartAnimationSignature> = ({ params, store }) => {
  React.useEffect(() => {
    store.set('animation', { ...store.state.animation, skip: params.skipAnimation });
  }, [store, params.skipAnimation]);

  const disableAnimation = React.useCallback(() => {
    let disableCalled = false;

    store.set('animation', {
      ...store.state.animation,
      skipAnimationRequests: store.state.animation.skipAnimationRequests + 1,
    });

    return () => {
      if (disableCalled) {
        return;
      }

      disableCalled = true;

      store.set('animation', {
        ...store.state.animation,
        skipAnimationRequests: store.state.animation.skipAnimationRequests - 1,
      });
    };
  }, [store]);

  useEnhancedEffect(() => {
    // Skip animation test/jsdom
    const isAnimationDisabledEnvironment = typeof window === 'undefined' || !window?.matchMedia;

    if (isAnimationDisabledEnvironment) {
      return undefined;
    }

    let disableAnimationCleanup: (() => void) | undefined;
    const handleMediaChange = (event: MediaQueryList | MediaQueryListEvent) => {
      if (event.matches) {
        disableAnimationCleanup = disableAnimation();
      } else {
        disableAnimationCleanup?.();
      }
    };

    const mql = window.matchMedia('(prefers-reduced-motion)');

    handleMediaChange(mql);

    mql.addEventListener('change', handleMediaChange);

    return () => {
      mql.removeEventListener('change', handleMediaChange);
    };
  }, [disableAnimation, store]);

  return { instance: { disableAnimation } };
};

useChartAnimation.params = {
  skipAnimation: true,
};

useChartAnimation.getDefaultizedParams = ({ params }) => ({
  ...params,
  skipAnimation: params.skipAnimation ?? false,
});

useChartAnimation.getInitialState = ({ skipAnimation }) => {
  const isAnimationDisabledEnvironment = typeof window === 'undefined' || !window?.matchMedia;

  // We use the value of `isAnimationDisabledEnvironment` as the initial value of `skipAnimation` to avoid
  // re-rendering the component on environments where matchMedia is not supported, hence skipAnimation will always be true.
  const disableAnimations = process.env.IS_TEST_ENV ? isAnimationDisabledEnvironment : false;

  return {
    animation: {
      skip: skipAnimation,
      // By initializing the skipAnimationRequests to 1, we ensure that the animation is always skipped
      skipAnimationRequests: disableAnimations ? 1 : 0,
    },
  };
};
