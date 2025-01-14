import * as React from 'react';
import { warnOnce } from '@mui/x-internals/warning';
import { TreeViewPlugin } from '../../models';
import { TreeViewItemId } from '../../../models';
import { UseTreeViewLabelSignature } from './useTreeViewLabel.types';
import { useTreeViewLabelItemPlugin } from './useTreeViewLabel.itemPlugin';

export const useTreeViewLabel: TreeViewPlugin<UseTreeViewLabelSignature> = ({ store, params }) => {
  const setEditedItemId = (editedItemId: TreeViewItemId | null) => {
    store.update((prevState) => ({ ...prevState, label: { editedItemId } }));
  };

  const updateItemLabel = (itemId: TreeViewItemId, label: string) => {
    if (!label) {
      throw new Error(
        [
          'MUI X: The Tree View component requires all items to have a `label` property.',
          'The label of an item cannot be empty.',
          itemId,
        ].join('\n'),
      );
    }
    store.update((prevState) => {
      const item = prevState.items.itemMetaLookup[itemId];
      if (item.label !== label) {
        return {
          ...prevState,
          items: {
            ...prevState.items,
            itemMetaLookup: { ...prevState.items.itemMetaLookup, [itemId]: { ...item, label } },
          },
        };
      }

      return prevState;
    });

    if (params.onItemLabelChange) {
      params.onItemLabelChange(itemId, label);
    }
  };

  const pluginContextValue = React.useMemo(
    () => ({ label: { isItemEditable: params.isItemEditable } }),
    [params.isItemEditable],
  );

  return {
    instance: {
      setEditedItemId,
      updateItemLabel,
    },
    publicAPI: {
      updateItemLabel,
    },
    contextValue: pluginContextValue,
  };
};

useTreeViewLabel.itemPlugin = useTreeViewLabelItemPlugin;

useTreeViewLabel.getDefaultizedParams = ({ params, experimentalFeatures }) => {
  const canUseFeature = experimentalFeatures?.labelEditing;
  if (process.env.NODE_ENV !== 'production') {
    if (params.isItemEditable && !canUseFeature) {
      warnOnce([
        'MUI X: The label editing feature requires the `labelEditing` experimental feature to be enabled.',
        'You can do it by passing `experimentalFeatures={{ labelEditing: true}}` to the Rich Tree View Pro component.',
        'Check the documentation for more details: https://mui.com/x/react-tree-view/rich-tree-view/editing/',
      ]);
    }
  }

  return {
    ...params,
    isItemEditable: canUseFeature ? (params.isItemEditable ?? false) : false,
  };
};

useTreeViewLabel.getInitialState = () => ({
  label: { editedItemId: null },
});

useTreeViewLabel.params = {
  onItemLabelChange: true,
  isItemEditable: true,
};
