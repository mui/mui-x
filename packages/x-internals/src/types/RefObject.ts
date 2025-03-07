import * as React from 'react';

/**
 * Defines the reference as `React.RefObject` for React 19 and up and `React.MutableRefObject` for React 18 and below.
 * Can be used to maintain the types between the React versions while migrating away from `React.MutableRefObject` in the codebase.
 *
 * @template T - The type to make the reference object from.
 */
// in React 19 useRef requires a parameter, so () => infer R will not match anymore
export type RefObject<T> = typeof React.useRef extends () => any
  ? React.MutableRefObject<T>
  : React.RefObject<T>;
