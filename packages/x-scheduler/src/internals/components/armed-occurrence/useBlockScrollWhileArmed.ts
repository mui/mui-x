'use client';
import * as React from 'react';

/**
 * While `active`, blocks wheel/touch scrolling document-wide so nothing scrolls under the toolbar.
 * Gestures matching `ignoreSelector` (the resize handle) pass through, so the armed event still resizes.
 */
export function useBlockScrollWhileArmed(parameters: { active: boolean; ignoreSelector?: string }) {
  const { active, ignoreSelector } = parameters;

  React.useEffect(() => {
    if (!active || typeof document === 'undefined') {
      return undefined;
    }
    const preventScroll = (event: Event) => {
      const target = event.composedPath()[0];
      if (ignoreSelector && target instanceof Element && target.closest(ignoreSelector)) {
        return;
      }
      // Non-passive listeners, so this actually cancels the scroll.
      event.preventDefault();
    };
    const options = { capture: true, passive: false } as const;
    document.addEventListener('wheel', preventScroll, options);
    document.addEventListener('touchmove', preventScroll, options);
    return () => {
      document.removeEventListener('wheel', preventScroll, options);
      document.removeEventListener('touchmove', preventScroll, options);
    };
  }, [active, ignoreSelector]);
}
