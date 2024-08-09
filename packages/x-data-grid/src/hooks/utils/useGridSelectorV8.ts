import * as React from 'react';
import type { GridApiCommon } from '../../models/api/gridApiCommon';
import { OutputSelectorV8 } from '../../utils/createSelectorV8';
import { useLazyRef } from './useLazyRef';
import { useOnMount } from './useOnMount';
import { warnOnce } from '../../internals/utils/warning';
import type { GridCoreApi } from '../../models/api/gridCoreApi';
import { fastObjectShallowCompare } from '../../utils/fastObjectShallowCompare';

function isOutputSelector<Api extends GridApiCommon, Args, T>(
  selector: any,
): selector is OutputSelectorV8<Api['state'], Args, T> {
  return selector.acceptsApiRef;
}

function applySelectorV8<Api extends GridApiCommon, Args, T>(
  apiRef: React.MutableRefObject<Api>,
  selector: ((state: Api['state']) => T) | OutputSelectorV8<Api['state'], Args, T>,
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

export const useGridSelectorV8 = <Api extends GridApiCommon, Args, T>(
  apiRef: React.MutableRefObject<Api>,
  selector: ((state: Api['state']) => T) | OutputSelectorV8<Api['state'], Args, T>,
  args: Args = {} as Args,
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
