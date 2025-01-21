import * as React from 'react';
import reactMajor from '../reactMajor';

// in React 19 useRef requires a parameter, so () => infer R will not match anymore
export type ApiRef<T> = typeof React.useRef<T> extends () => infer R
  ? R extends React.MutableRefObject<infer M | undefined>
    ? // In v7 we remove the possibility of undefined for MutableRefObject (see https://github.com/mui/mui-x/issues/16135#issuecomment-2589395230)
      React.MutableRefObject<M>
    : R
  : React.RefObject<T>;

// Makes sure apiRef is still MutableRefObject in React 18 and RefObject in React 19 and above
export const useRef = <T,>(initialValue?: T | null): ApiRef<T> => {
  const actualInitialValue = initialValue === undefined && reactMajor >= 19 ? null : initialValue;
  return React.useRef(actualInitialValue) as ApiRef<T>;
};
