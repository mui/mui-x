'use client';
import * as React from 'react';
import { useStore } from '@mui/x-internals/store';
import { EventHandlers } from '@mui/utils/types';
import { TreeViewCancellableEvent } from '../../models';
import { idSelectors } from '../corePlugins/useTreeViewId';
import { selectionSelectors } from '../plugins/useTreeViewSelection';
import { itemsSelectors } from '../plugins/useTreeViewItems';
import { TreeViewStore } from '../models';

export function useTreeViewRootProps<TStore extends TreeViewStore<any, any>>(
  store: TStore,
  forwardedProps: React.HTMLAttributes<HTMLUListElement>,
  ref: React.Ref<HTMLUListElement | null> | undefined,
) {
  const treeId = useStore(store, idSelectors.treeId);
  const itemChildrenIndentation = useStore(store, itemsSelectors.itemChildrenIndentation);
  const isMultiSelectEnabled = useStore(store, selectionSelectors.isMultiSelectEnabled);

  return (otherHandlers: EventHandlers) => ({
    ref,
    role: 'tree',
    id: treeId,
    'aria-multiselectable': isMultiSelectEnabled,
    ...forwardedProps,
    ...otherHandlers,
    style: {
      '--TreeView-itemChildrenIndentation':
        typeof itemChildrenIndentation === 'number'
          ? `${itemChildrenIndentation}px`
          : itemChildrenIndentation,
    } as React.CSSProperties,
    onFocus: (event: React.FocusEvent<HTMLUListElement> & TreeViewCancellableEvent) => {
      otherHandlers.onFocus?.(event);
      store.handleRootFocus(event);
    },
    onBlur: (event: React.FocusEvent<HTMLUListElement> & TreeViewCancellableEvent) => {
      otherHandlers.onBlur?.(event);
      store.handleRootBlur(event);
    },
  });
}
