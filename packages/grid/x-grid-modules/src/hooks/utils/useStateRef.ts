import * as React from 'react';

/**
 * Allow to put a forwarded ref in the dependency array of an effect and do something when current change.
 */
export function useStateRef<T>(forwaredRef: React.RefObject<T>) {
  const [refState, setRefState] = React.useState(forwaredRef.current);
  const prevColumnsRef = React.useRef<T | null>(null);
  if (prevColumnsRef && forwaredRef && prevColumnsRef.current !== forwaredRef.current) {
    prevColumnsRef.current = forwaredRef.current;
    setRefState(forwaredRef.current);
  }
  return refState;
}
