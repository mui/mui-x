'use client';
import * as React from 'react';
import { useStore } from '@mui/x-internals/store';
import { useRtl } from '@mui/system/RtlProvider';
import { useTimeout } from '@base-ui-components/utils/useTimeout';
import { useEventCallback } from '@base-ui-components/utils/useEventCallback';
import { TreeViewCancellableEvent } from '../../../models';
import { TreeViewItemMeta, TreeViewPlugin } from '../../models';
import {
  getFirstNavigableItem,
  getLastNavigableItem,
  getNextNavigableItem,
  getPreviousNavigableItem,
  isTargetInDescendants,
} from '../../utils/tree';
import {
  TreeViewLabelMap,
  UseTreeViewKeyboardNavigationSignature,
} from './useTreeViewKeyboardNavigation.types';
import { itemsSelectors } from '../useTreeViewItems/useTreeViewItems.selectors';

export const useTreeViewKeyboardNavigation: TreeViewPlugin<
  UseTreeViewKeyboardNavigationSignature
> = ({ instance, store, params }) => {
  const isRtl = useRtl();
  const labelMap = React.useRef<TreeViewLabelMap>({});

  const typeaheadQueryRef = React.useRef<string>('');
  const typeaheadTimeout = useTimeout();

  const updateLabelMap = useEventCallback(
    (callback: (labelMap: TreeViewLabelMap) => TreeViewLabelMap) => {
      labelMap.current = callback(labelMap.current);
    },
  );

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

  return {
    instance: {
      updateLabelMap,
    },
  };
};

useTreeViewKeyboardNavigation.params = {};
