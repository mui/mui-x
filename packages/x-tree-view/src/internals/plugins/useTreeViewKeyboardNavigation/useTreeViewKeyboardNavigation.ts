'use client';
import * as React from 'react';
import { useStore } from '@mui/x-internals/store';
import { TreeViewItemMeta, TreeViewPlugin } from '../../models';
import {
  TreeViewLabelMap,
  UseTreeViewKeyboardNavigationSignature,
} from './useTreeViewKeyboardNavigation.types';
import { itemsSelectors } from '../useTreeViewItems/useTreeViewItems.selectors';

export const useTreeViewKeyboardNavigation: TreeViewPlugin<
  UseTreeViewKeyboardNavigationSignature
> = ({ instance, store, params }) => {
  const labelMap = React.useRef<TreeViewLabelMap>({});

  const itemMetaLookup = useStore(store, itemsSelectors.itemMetaLookup);
  React.useEffect(() => {
    if (instance.areItemUpdatesPrevented()) {
      return;
    }

    const newLabelMap: { [itemId: string]: string } = {};

    const processItem = (item: TreeViewItemMeta) => {
      newLabelMap[item.id] = item.label!.toLowerCase();
    };

    Object.values(itemMetaLookup).forEach(processItem);
    labelMap.current = newLabelMap;
  }, [itemMetaLookup, params.getItemId, instance]);
};
