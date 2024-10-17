import * as React from 'react';
import { TreeViewPlugin } from '../../models';
import { UseTreeViewIdSignature } from './useTreeViewId.types';
import { createTreeViewDefaultId } from './useTreeViewId.utils';

export const useTreeViewId: TreeViewPlugin<UseTreeViewIdSignature> = ({
  params,
  state,
  setState,
}) => {
  React.useEffect(() => {
    setState((prevState) => {
      if (prevState.id.treeId === params.id && prevState.id.treeId !== undefined) {
        return prevState;
      }

      return {
        ...prevState,
        id: { ...prevState.id, treeId: params.id ?? createTreeViewDefaultId() },
      };
    });
  }, [setState, params.id]);

  const treeId = params.id ?? state.id.treeId;

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

useTreeViewId.getInitialState = ({ id }) => ({ id: { treeId: id ?? undefined } });
