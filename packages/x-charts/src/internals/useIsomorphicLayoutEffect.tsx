import * as React from 'react';

// Source:
// https://github.com/pmndrs/react-spring/blob/eb09c7914721c2e5957c4bc817d7abddf317576c/docs/app/hooks/useIsomorphicEffect.ts#L1

// For server-side rendering: https://github.com/react-spring/zustand/pull/34
// Deno support: https://github.com/pmndrs/zustand/issues/347
const isSSR =
  typeof window === 'undefined' ||
  !window.navigator ||
  /ServerSideRendering|^Deno\//.test(window.navigator.userAgent);

export const useIsomorphicLayoutEffect = isSSR ? React.useEffect : React.useLayoutEffect;
