'use client';
import { useIsoLayoutEffect } from '@base-ui/utils/useIsoLayoutEffect';
import { useOnMount } from '@base-ui/utils/useOnMount';
import { useDisposable } from '@mui/x-internals/useDisposable';
import { useRtl } from '@mui/system/RtlProvider';
import useId from '@mui/utils/useId';
import type { TreeViewAnyStore } from '../models';

interface ValidTreeViewStoreConstructor<TStore extends TreeViewAnyStore> {
  new (parameters: TStore['parameters']): TStore;
}

export type UseTreeViewStoreParameters<TStore extends TreeViewAnyStore> = Omit<
  Parameters<TStore['updateStateFromParameters']>[0],
  'isRtl' | 'defaultId'
>;

/**
 * Creates a Tree View store and keep it in sync with the provided parameters.
 */
export function useTreeViewStore<TStore extends TreeViewAnyStore>(
  StoreClass: ValidTreeViewStoreConstructor<TStore>,
  parameters: UseTreeViewStoreParameters<TStore>,
): TStore {
  const isRtl = useRtl();
  const defaultId = useId();
  const store = useDisposable(() => new StoreClass({ ...parameters, isRtl, defaultId }));

  useIsoLayoutEffect(
    () => store.updateStateFromParameters({ ...parameters, isRtl, defaultId }),
    [store, isRtl, defaultId, parameters],
  );

  // Mount-time side effects (e.g. kicking off lazy-loading fetches). The store is
  // created during render by `useDisposable`, so these can't run in the factory.
  useOnMount(store.mountEffect);

  return store;
}
