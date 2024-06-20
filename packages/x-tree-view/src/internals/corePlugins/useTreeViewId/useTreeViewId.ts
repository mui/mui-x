import * as React from 'react';
import useId from '@mui/utils/useId';
import { TreeViewPlugin } from '../../models';
import { UseTreeViewIdSignature } from './useTreeViewId.types';

export const useTreeViewId: TreeViewPlugin<UseTreeViewIdSignature> = ({ params }) => {
  const treeId = useId(params.id);

  const getTreeItemIdAttribute = React.useCallback(
    (itemId: string, idAttribute: string | undefined) => idAttribute ?? `${treeId}-${itemId}`,
    [treeId],
  );

  return {
    getRootProps: () => ({
      id: treeId,
    }),
    instance: {
      getTreeItemIdAttribute,
    },
  };
};

useTreeViewId.params = {
  id: true,
};
