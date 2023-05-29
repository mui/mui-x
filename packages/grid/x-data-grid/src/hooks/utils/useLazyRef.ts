import * as React from 'react';

const UNINITIALIZED = {};

export function useLazyRef<T, U>(init: (arg?: U) => T, initArg?: U) {
  const ref = React.useRef(UNINITIALIZED as unknown as T);

  if (ref.current === UNINITIALIZED) {
    ref.current = init(initArg);
  }

  return ref;
}
