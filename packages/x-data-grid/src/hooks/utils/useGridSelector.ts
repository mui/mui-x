import * as React from 'react';
import { fastObjectShallowCompare } from '@mui/x-internals/fastObjectShallowCompare';
import type { GridApiCommon } from '../../models/api/gridApiCommon';
import { OutputSelector, OutputSelectorV8 } from '../../utils/createSelector';
import { useLazyRef } from './useLazyRef';
import { useOnMount } from './useOnMount';
import { warnOnce } from '../../internals/utils/warning';
import type { GridCoreApi } from '../../models/api/gridCoreApi';

function isOutputSelector<Api extends GridApiCommon, T>(
  selector: any,
): selector is OutputSelector<Api['state'], T> {
  return selector.acceptsApiRef;
}

type Selector<Api extends GridApiCommon, Args, T> =
  | ((state: Api['state']) => T)
  | OutputSelectorV8<Api['state'], Args, T>;

// TODO v8: Remove this function
function applySelector<Api extends GridApiCommon, T>(
  apiRef: React.MutableRefObject<Api>,
  selector: ((state: Api['state']) => T) | OutputSelector<Api['state'], T>,
) {
  if (isOutputSelector<Api, T>(selector)) {
    return selector(apiRef);
  }
  return selector(apiRef.current.state);
}

// TODO v8: Rename this function to `applySelector`
function applySelectorV8<Api extends GridApiCommon, Args, T>(
  apiRef: React.MutableRefObject<Api>,
  selector: Selector<Api, Args, T>,
  args: Args,
  instanceId: GridCoreApi['instanceId'],
) {
  if (isOutputSelector(selector)) {
    return selector(apiRef, args);
  }
  return selector(apiRef.current.state, instanceId);
}

const defaultCompare = Object.is;
export const objectShallowCompare = fastObjectShallowCompare;

const createRefs = () => ({ state: null, equals: null, selector: null }) as any;

// TODO v8: Remove this function
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

// TODO v8: Rename this function to `useGridSelector`
export const useGridSelectorV8 = <Api extends GridApiCommon, Args, T>(
  apiRef: React.MutableRefObject<Api>,
  selector: Selector<Api, Args, T>,
  args: Args = undefined as Args,
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
    (didInit ? null : applySelectorV8(apiRef, selector, args, apiRef.current.instanceId)) as T,
  );

  refs.current.state = state;
  refs.current.equals = equals;
  refs.current.selector = selector;

  useOnMount(() => {
    return apiRef.current.store.subscribe(() => {
      const newState = applySelectorV8(
        apiRef,
        refs.current.selector,
        args,
        apiRef.current.instanceId,
      ) as T;
      if (!refs.current.equals(refs.current.state, newState)) {
        refs.current.state = newState;
        setState(newState);
      }
    });
  });

  return state;
};
