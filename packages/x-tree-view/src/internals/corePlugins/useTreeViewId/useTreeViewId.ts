'use client';
import * as React from 'react';
import { useStore } from '@mui/x-internals/store';
import { TreeViewPlugin } from '../../models';
import { UseTreeViewIdSignature } from './useTreeViewId.types';
import { idSelectors } from './useTreeViewId.selectors';
import { createTreeViewDefaultId } from './useTreeViewId.utils';

export const useTreeViewId: TreeViewPlugin<UseTreeViewIdSignature> = ({ params, store }) => {
  React.useEffect(() => {
    const prevIdState = store.state.id;
    if (params.id === prevIdState.providedTreeId && prevIdState.treeId !== undefined) {
      return;
    }

    store.set('id', { ...prevIdState, treeId: params.id ?? createTreeViewDefaultId() });
  }, [store, params.id]);

  const treeId = useStore(store, idSelectors.treeId);

  return {
    getRootProps: () => ({
      id: treeId,
    }),
  };
};

useTreeViewId.params = {
  id: true,
};

useTreeViewId.getInitialState = ({ id }) => ({ id: { treeId: undefined, providedTreeId: id } });
