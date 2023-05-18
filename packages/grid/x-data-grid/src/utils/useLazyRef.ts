import React from 'react';

const UNINITIALIZED = {};

export default function useLazyRef<T>(
  initFn: (initVal?: any) => T,
  initVal?: any,
): React.MutableRefObject<T> {
  const ref = React.useRef<T>(UNINITIALIZED as any) as React.MutableRefObject<T>;

  if (ref.current === (UNINITIALIZED as any)) {
    ref.current = initFn(initVal);
  }

  return ref;
}
