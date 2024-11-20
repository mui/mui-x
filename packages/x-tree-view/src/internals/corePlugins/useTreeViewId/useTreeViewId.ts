import * as React from 'react';
import { TreeViewPlugin } from '../../models';
import { UseTreeViewIdSignature } from './useTreeViewId.types';
import { useSelector } from '../../hooks/useSelector';
import { selectorTreeViewId } from './useTreeViewId.selectors';
import { createTreeViewDefaultId } from './useTreeViewId.utils';

export const useTreeViewId: TreeViewPlugin<UseTreeViewIdSignature> = ({ params, store }) => {
  React.useEffect(() => {
    store.update((prevState) => {
      if (params.id === prevState.id.providedTreeId && prevState.id.treeId !== undefined) {
        return prevState;
      }

      return {
        ...prevState,
        id: { ...prevState.id, treeId: params.id ?? createTreeViewDefaultId() },
      };
    });
  }, [store, params.id]);

  const treeId = useSelector(store, selectorTreeViewId);

  const pluginContextValue = React.useMemo(() => ({ treeId }), [treeId]);

  return {
    getRootProps: () => ({
      id: treeId,
    }),
    contextValue: pluginContextValue,
  };
};

useTreeViewId.params = {
  id: true,
};

useTreeViewId.getInitialState = ({ id }) => ({ id: { treeId: undefined, providedTreeId: id } });
