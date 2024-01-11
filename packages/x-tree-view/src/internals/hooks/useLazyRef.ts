import * as React from 'react';

const UNINITIALIZED = {};

// See https://github.com/facebook/react/issues/14490 for when to use this.
export function useLazyRef<T, U>(init: (arg?: U) => T, initArg?: U) {
  const ref = React.useRef(UNINITIALIZED as unknown as T);

  if (ref.current === UNINITIALIZED) {
    ref.current = init(initArg);
  }

  return ref;
}
