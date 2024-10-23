import * as React from 'react';
import { TreeViewPlugin } from '../../models';
import { UseTreeViewObjectItemsSignature } from './useTreeViewObjectItems.types';

export const useTreeViewObjectItems: TreeViewPlugin<UseTreeViewObjectItemsSignature> = ({
  slots,
  slotProps,
}) => {
  const pluginContextValue = React.useMemo(
    () => ({ objectItems: { slot: slots.item, slotProps: slotProps.item } }),
    [slots.item, slotProps.item],
  );

  return {
    contextValue: pluginContextValue,
  };
};

useTreeViewObjectItems.params = {};
