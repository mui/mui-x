'use client';
import { useIsomorphicLayoutEffect, Globals } from '@react-spring/web';

const handleMediaChange = (e: { matches: boolean | undefined }) => {
  Globals.assign({
    // Modification such the react-spring implementation such that this hook can remove animation but never activate animation.
    skipAnimation: e.matches || undefined,
  });
};

/**
 * Returns `boolean` or `null`, used to automatically
 * set skipAnimations to the value of the user's
 * `prefers-reduced-motion` query.
 *
 * The return value, post-effect, is the value of their preferred setting
 */
export const useReducedMotion = () => {
  // Taken from: https://github.com/pmndrs/react-spring/blob/fd65b605b85c3a24143c4ce9dd322fdfca9c66be/packages/shared/src/hooks/useReducedMotion.ts

  useIsomorphicLayoutEffect(() => {
    // Skip animation test/jsdom
    const shouldSkipAnimation = !window?.matchMedia;

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
};
