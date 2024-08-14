import * as React from 'react';
import { fastObjectShallowCompare } from '@mui/x-internals/fastObjectShallowCompare';
import type { GridApiCommon } from '../../models/api/gridApiCommon';
import { OutputSelector } from '../../utils/createSelector';
import { useLazyRef } from './useLazyRef';
import { useOnMount } from './useOnMount';
import { warnOnce } from '../../internals/utils/warning';

function isOutputSelector<Api extends GridApiCommon, T>(
  selector: any,
): selector is OutputSelector<Api['state'], T> {
  return selector.acceptsApiRef;
}

function applySelector<Api extends GridApiCommon, T>(
  apiRef: React.MutableRefObject<Api>,
  selector: ((state: Api['state']) => T) | OutputSelector<Api['state'], T>,
) {
  if (isOutputSelector<Api, T>(selector)) {
    return selector(apiRef);
  }
  return selector(apiRef.current.state);
}

const defaultCompare = Object.is;
export const objectShallowCompare = fastObjectShallowCompare;

const createRefs = () => ({ state: null, equals: null, selector: null }) as any;

export const useGridSelector = <Api extends GridApiCommon, T>(
  apiRef: React.MutableRefObject<Api>,
  selector: ((state: Api['state']) => T) | OutputSelector<Api['state'], T>,
  equals: (a: T, b: T) => boolean = defaultCompare,
) => {
  if (process.env.NODE_ENV !== 'production') {
    if (!apiRef.current.state) {
      warnOnce([
        'MUI X: `useGridSelector` has been called before the initialization of the state.',
        'This hook can only be used inside the context of the grid.',
      ]);
    }
  }

  const refs = useLazyRef<
    {
      state: T;
      equals: typeof equals;
      selector: typeof selector;
    },
    never
  >(createRefs);
  const didInit = refs.current.selector !== null;

  const [state, setState] = React.useState<T>(
    // We don't use an initialization function to avoid allocations
    (didInit ? null : applySelector(apiRef, selector)) as T,
  );

  refs.current.state = state;
  refs.current.equals = equals;
  refs.current.selector = selector;

  useOnMount(() => {
    return apiRef.current.store.subscribe(() => {
      const newState = applySelector(apiRef, refs.current.selector);
      if (!refs.current.equals(refs.current.state, newState)) {
        refs.current.state = newState;
        setState(newState);
      }
    });
  });

  return state;
};
