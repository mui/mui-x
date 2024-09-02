import * as React from 'react';
import { useIsomorphicLayoutEffect, Globals } from '@react-spring/web';
import { AnimationProviderProps } from './Animation.types';
import { AnimationContext } from './AnimationContext';

function AnimationProvider(props: AnimationProviderProps) {
  const { children, skipAnimation: inSkipAnimation } = props;

  // Taken from: https://github.com/pmndrs/react-spring/blob/fd65b605b85c3a24143c4ce9dd322fdfca9c66be/packages/shared/src/hooks/useReducedMotion.ts
  const [skipAnimation, setSkipAnimation] = React.useState<true | undefined>(undefined);

  useIsomorphicLayoutEffect(() => {
    // Skip animation test/jsdom
    const shouldSkipAnimation = !window?.matchMedia;

    const handleMediaChange = (e: { matches: boolean | undefined }) => {
      // Modification to the react-spring implementation such that this hook can remove animation but never activate it.
      const inputValue = e.matches || undefined;
      setSkipAnimation(inputValue);
      Globals.assign({
        skipAnimation: inputValue,
      });
    };

    if (shouldSkipAnimation) {
      handleMediaChange({ matches: true });
      return undefined;
    }

    const mql = window.matchMedia('(prefers-reduced-motion)');

    handleMediaChange(mql);

    // MatchMedia is not fully supported in all environments, so we need to check if it exists before calling addEventListener
    mql.addEventListener?.('change', handleMediaChange);

    return () => {
      mql.removeEventListener?.('change', handleMediaChange);
    };
  }, []);

  const value = React.useMemo(
    () => ({
      isInitialized: true,
      data: {
        // If dev sets `skipAnimation` to true, it will skip all animations.
        // If dev sets `skipAnimation` to false, it will use user's preference.
        skipAnimation: inSkipAnimation || skipAnimation,
      },
    }),
    [skipAnimation, inSkipAnimation],
  );

  return <AnimationContext.Provider value={value}>{children}</AnimationContext.Provider>;
}

export { AnimationProvider };
