import { useIsomorphicLayoutEffect, Globals } from '@react-spring/web';

/**
 * Returns `boolean` or `null`, used to automatically
 * set skipAnimations to the value of the user's
 * `prefers-reduced-motion` query.
 *
 * The return value, post-effect, is the value of their preferred setting
 */
export const useReducedMotion = () => {
  // Taken from: https://github.com/pmndrs/react-spring/blob/02ec877bbfab0df46da0e4a47d5f68d3e731206a/packages/shared/src/hooks/useReducedMotion.ts#L13

  useIsomorphicLayoutEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion)');

    const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
      Globals.assign({
        // Modification such the react-spring implementation such that this hook can remove animation but never activate animation.
        skipAnimation: e.matches || undefined,
      });
    };

    handleMediaChange(mql);

    mql.addEventListener('change', handleMediaChange);

    return () => {
      mql.removeEventListener('change', handleMediaChange);
    };
  }, []);
};
