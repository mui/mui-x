import * as React from 'react';
import useId from '@mui/utils/useId';
import { TreeViewPlugin } from '../../models';
import { populateInstance } from '../../useTreeView/useTreeView.utils';
import { UseTreeViewIdSignature } from './useTreeViewId.types';

export const useTreeViewId: TreeViewPlugin<UseTreeViewIdSignature> = ({ instance, params }) => {
  const treeId = useId(params.id);

  const getTreeItemIdAttribute = React.useCallback(
    (itemId: string, idAttribute: string | undefined) => idAttribute ?? `${treeId}-${itemId}`,
    [treeId],
  );

  populateInstance<UseTreeViewIdSignature>(instance, {
    getTreeItemIdAttribute,
  });

  return {
    getRootProps: () => ({
      id: treeId,
    }),
  };
};

useTreeViewId.params = {
  id: true,
};
