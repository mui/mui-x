'use client';
import { useStore } from '@mui/x-internals/store';
import { TreeViewPlugin } from '../../models';
import { UseTreeViewIdSignature } from './useTreeViewId.types';
import { idSelectors } from './useTreeViewId.selectors';

export const useTreeViewId: TreeViewPlugin<UseTreeViewIdSignature> = ({ store }) => {
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
