import { RefObject, useRef, useState } from 'react';

/**
 * allow to put a forwarded ref in the dependency array of an effect and do something when current change
 */
export function useStateRef<T>(forwaredRef: RefObject<T>) {
  const [refState, setRefState] = useState(forwaredRef.current);
  const prevColumnsRef = useRef<T | null>(null);
  if (prevColumnsRef && forwaredRef && prevColumnsRef.current !== forwaredRef.current) {
    prevColumnsRef.current = forwaredRef.current;
    setRefState(forwaredRef.current);
  }
  return refState;
}
