import * as React from 'react';
import { TreeViewPlugin } from '../../models';
import { UseTreeViewIdSignature } from './useTreeViewId.types';
import { useSelector } from '../../hooks/useSelector';
import { selectorTreeViewId } from './useTreeViewId.selectors';

let globalId = 0;

export const useTreeViewId: TreeViewPlugin<UseTreeViewIdSignature> = ({ params, store }) => {
  const treeId = useSelector(store, selectorTreeViewId);

  React.useEffect(() => {
    store.update((prevState) => {
      if (prevState.id.treeId === params.id) {
        return prevState;
      }

      if (params.id == null) {
        globalId += 1;
      }

      return {
        ...prevState,
        id: { ...prevState.id, treeId: params.id ?? `mui-tree-view-${globalId}` },
      };
    });
  }, [store, params.id]);

  return {
    getRootProps: () => ({
      id: treeId,
    }),
  };
};

useTreeViewId.params = {
  id: true,
};

useTreeViewId.getInitialState = ({ id }) => ({ id: { treeId: id } });
