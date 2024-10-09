import * as React from 'react';
import { TreeViewPlugin } from '../../models';
import { UseTreeViewIdSignature } from './useTreeViewId.types';
import { createTreeViewDefaultId } from './useTreeViewId.utils';

export const useTreeViewId: TreeViewPlugin<UseTreeViewIdSignature> = ({
  params,
  state,
  setState,
}) => {
  const treeId = state.id.treeId;

  React.useEffect(() => {
    setState((prevState) => {
      if (prevState.id.treeId === params.id) {
        return prevState;
      }

      return {
        ...prevState,
        id: { ...prevState.id, treeId: params.id ?? createTreeViewDefaultId() },
      };
    });
  }, [setState, params.id]);

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
