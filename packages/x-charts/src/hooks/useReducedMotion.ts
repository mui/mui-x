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
    if (!window.matchMedia) {
      // skip animation in environments where `window.matchMedia` would not be available (i.e. test/jsdom)
      Globals.assign({
        skipAnimation: true,
      });
      return () => {};
    }
    const mql = window.matchMedia('(prefers-reduced-motion)');

    const handleMediaChange = (event: MediaQueryListEvent | MediaQueryList) => {
      Globals.assign({
        // Modification such the react-spring implementation such that this hook can remove animation but never activate animation.
        skipAnimation: event.matches || undefined,
      });
    };

    handleMediaChange(mql);

    // MatchMedia is not fully supported in all environments, so we need to check if it exists before calling addEventListener
    mql.addEventListener?.('change', handleMediaChange);

    return () => {
      mql.removeEventListener?.('change', handleMediaChange);
    };
  }, []);
};
