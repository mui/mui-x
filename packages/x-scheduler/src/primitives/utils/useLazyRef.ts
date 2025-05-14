'use client';
import * as React from 'react';

const UNINITIALIZED = {};

// TODO: Use the `useLazyRef` hook from the base-ui-copy package when it is available.
/**
 * A React.useRef() that is initialized lazily with a function. Note that it accepts an optional
 * initialization argument, so the initialization function doesn't need to be an inline closure.
 *
 * @usage
 *   const ref = useLazyRef(sortColumns, columns)
 */
export function useLazyRef<T, U>(init: (arg?: U) => T, initArg?: U) {
  const ref = React.useRef(UNINITIALIZED as unknown as T);

  if (ref.current === UNINITIALIZED) {
    ref.current = init(initArg);
  }

  return ref;
}
