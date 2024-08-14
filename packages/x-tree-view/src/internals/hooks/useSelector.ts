import * as React from 'react';
import { OutputSelector } from '../utils/createSelector';
import { warnOnce } from '../utils/warning';
import { useLazyRef } from './useLazyRef';
import { useOnMount } from './useOnMount';
import { UseTreeViewSelectorsInstance } from '../corePlugins/useTreeViewSelectors';
import { TreeViewAnyPluginSignature, TreeViewInstance, TreeViewState } from '../models';

function isOutputSelector<TState extends {}, T>(
  selector: any,
): selector is OutputSelector<TState, T> {
  return selector.acceptsInstance;
}

function applySelector<TState extends {}, T>(
  instance: UseTreeViewSelectorsInstance<TState>,
  selector: ((state: TState) => T) | OutputSelector<TState, T>,
) {
  if (isOutputSelector<TState, T>(selector)) {
    return selector(instance);
  }
  return selector(instance.selectorsCache.state);
}

const defaultCompare = Object.is;

const createRefs = () => ({ state: null, equals: null, selector: null }) as any;

export const useSelector = <TSignature extends readonly TreeViewAnyPluginSignature[], T>(
  instance: TreeViewInstance<TSignature>,
  selector:
    | ((state: TreeViewState<TSignature>) => T)
    | OutputSelector<TreeViewState<TSignature>, T>,
  equals: (a: T, b: T) => boolean = defaultCompare,
) => {
  if (process.env.NODE_ENV !== 'production') {
    if (!instance.selectorsCache.state) {
      warnOnce([
        'MUI X: `useSelector` has been called before the initialization of the state.',
        'This hook can only be used inside the context of the tree view.',
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
    (didInit ? null : applySelector(instance, selector)) as T,
  );

  refs.current.state = state;
  refs.current.equals = equals;
  refs.current.selector = selector;

  useOnMount(() => {
    return instance.selectorsCache.store.subscribe(() => {
      const newState = applySelector(instance, refs.current.selector);
      if (!refs.current.equals(refs.current.state, newState)) {
        refs.current.state = newState;
        setState(newState);
      }
    });
  });

  return state;
};
