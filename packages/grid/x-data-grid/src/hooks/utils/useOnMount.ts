import * as React from 'react';

const EMPTY = [] as unknown[];

export function useOnMount(fn: React.EffectCallback) {
  /* eslint-disable react-hooks/exhaustive-deps */
  React.useEffect(fn, EMPTY);
  /* eslint-enable react-hooks/exhaustive-deps */
}
