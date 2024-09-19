import * as React from 'react';
import { TreeViewPlugin } from '../../models';
import { UseTreeViewIdSignature } from './useTreeViewId.types';
import { useSelector } from '../../hooks/useSelector';
import { selectorTreeViewId } from './useTreeViewId.selectors';
import { createTreeViewDefaultId } from './useTreeViewId.utils';

export const useTreeViewId: TreeViewPlugin<UseTreeViewIdSignature> = ({ params, store }) => {
  const treeId = useSelector(store, selectorTreeViewId);

  React.useEffect(() => {
    store.update((prevState) => {
      if (prevState.id.treeId === params.id) {
        return prevState;
      }

      return {
        ...prevState,
        id: { ...prevState.id, treeId: params.id ?? createTreeViewDefaultId() },
      };
    });
  }, [store, params.id]);

  return {
    getRootProps: () => ({
      id: treeId,
    }),
    contextValue: {
      treeId,
    },
  };
};

useTreeViewId.params = {
  id: true,
};

useTreeViewId.getInitialState = ({ id }) => ({ id: { treeId: id ?? createTreeViewDefaultId() } });
