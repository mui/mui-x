'use client';
import * as React from 'react';
import { useStore } from '@mui/x-internals/store';
import { TreeViewCancellableEvent, TreeViewCancellableEventHandler } from '@mui/x-tree-view/models';
import {
  TreeViewItemPlugin,
  useTreeViewContext,
  isTargetInDescendants,
} from '@mui/x-tree-view/internals';
import { TreeItemDragAndDropOverlayProps } from '@mui/x-tree-view/TreeItemDragAndDropOverlay';
import { TreeViewItemItemReorderingValidActions } from './types';
import { itemsReorderingSelectors } from './selectors';
import { RichTreeViewProStore } from '../../RichTreeViewProStore';

export const isAndroid = () => navigator.userAgent.toLowerCase().includes('android');

export const useTreeViewItemsReorderingItemPlugin: TreeViewItemPlugin = ({ props }) => {
  const { store } = useTreeViewContext<RichTreeViewProStore<any, any>>();
  const { itemId } = props;

  const validActionsRef = React.useRef<TreeViewItemItemReorderingValidActions | null>(null);

  const draggedItemProperties = useStore(
    store,
    itemsReorderingSelectors.draggedItemProperties,
    itemId,
  );
  const canItemBeReordered = useStore(store, itemsReorderingSelectors.canItemBeReordered, itemId);
  const isDragging = useStore(store, itemsReorderingSelectors.isDragging, itemId);

  return {
    propsEnhancers: {
      root: ({
        rootRefObject,
        contentRefObject,
        externalEventHandlers,
      }): UseTreeItemRootSlotPropsFromItemsReordering => {
        const handleDragStart = (event: React.DragEvent & TreeViewCancellableEvent) => {
          externalEventHandlers.onDragStart?.(event);
          if (!canItemBeReordered || event.defaultMuiPrevented || event.defaultPrevented) {
            return;
          }

          // We don't use `event.currentTarget` here.
          // This is to allow people to pass `onDragStart` to another element than the root.
          if (isTargetInDescendants(event.target as HTMLElement, rootRefObject.current)) {
            return;
          }

          // Comment to show the children in the drag preview
          // TODO: Improve the customization of the drag preview
          event.dataTransfer.effectAllowed = 'move';
          event.dataTransfer.setDragImage(contentRefObject.current!, 0, 0);

          const { types } = event.dataTransfer;
          if (isAndroid() && !types.includes('text/plain') && !types.includes('text/uri-list')) {
            event.dataTransfer.setData('text/plain', 'android-fallback');
          }

          // iOS requires a media type to be defined
          event.dataTransfer.setData('application/mui-x', '');

          store.itemsReordering.startDraggingItem(itemId);
        };

        const handleRootDragOver = (event: React.DragEvent & TreeViewCancellableEvent) => {
          externalEventHandlers.onDragOver?.(event);
          if (event.defaultMuiPrevented) {
            return;
          }

          event.preventDefault();
        };

        const handleRootDragEnd = (event: React.DragEvent & TreeViewCancellableEvent) => {
          externalEventHandlers.onDragEnd?.(event);
          if (event.defaultMuiPrevented) {
            return;
          }

          // Check if the drag-and-drop was cancelled, possibly by pressing Escape
          if (event.dataTransfer.dropEffect === 'none') {
            store.itemsReordering.cancelDraggingItem();
            return;
          }

          store.itemsReordering.completeDraggingItem(itemId);
        };

        return {
          draggable: canItemBeReordered ? true : undefined,
          onDragStart: handleDragStart,
          onDragOver: handleRootDragOver,
          onDragEnd: handleRootDragEnd,
        };
      },
      content: ({
        externalEventHandlers,
        contentRefObject,
      }): UseTreeItemContentSlotPropsFromItemsReordering => {
        if (!isDragging) {
          return {};
        }

        const handleDragOver = (event: React.DragEvent & TreeViewCancellableEvent) => {
          externalEventHandlers.onDragOver?.(event);
          if (
            event.defaultMuiPrevented ||
            validActionsRef.current == null ||
            !contentRefObject.current
          ) {
            return;
          }

          const rect = contentRefObject.current.getBoundingClientRect();
          const y = event.clientY - rect.top;
          const x = event.clientX - rect.left;

          store.itemsReordering.setDragTargetItem({
            itemId,
            validActions: validActionsRef.current,
            targetHeight: rect.height,
            cursorY: y,
            cursorX: x,
            contentElement: contentRefObject.current!,
          });
        };

        const handleDragEnter = (event: React.DragEvent & TreeViewCancellableEvent) => {
          externalEventHandlers.onDragEnter?.(event);
          if (event.defaultMuiPrevented) {
            return;
          }

          validActionsRef.current = store.itemsReordering.getDroppingTargetValidActions(itemId);
        };

        return {
          onDragEnter: handleDragEnter,
          onDragOver: handleDragOver,
        };
      },
      dragAndDropOverlay: (): UseTreeItemDragAndDropOverlaySlotPropsFromItemsReordering => {
        if (!draggedItemProperties) {
          return {};
        }

        return {
          action: draggedItemProperties.action,
          style: {
            '--TreeView-targetDepth': draggedItemProperties.targetDepth,
          } as React.CSSProperties,
        };
      },
    },
  };
};

interface UseTreeItemRootSlotPropsFromItemsReordering {
  draggable?: true;
  onDragStart?: TreeViewCancellableEventHandler<React.DragEvent>;
  onDragOver?: TreeViewCancellableEventHandler<React.DragEvent>;
  onDragEnd?: TreeViewCancellableEventHandler<React.DragEvent>;
}

interface UseTreeItemContentSlotPropsFromItemsReordering {
  onDragEnter?: TreeViewCancellableEventHandler<React.DragEvent>;
  onDragOver?: TreeViewCancellableEventHandler<React.DragEvent>;
}

interface UseTreeItemDragAndDropOverlaySlotPropsFromItemsReordering extends TreeItemDragAndDropOverlayProps {}

declare module '@mui/x-tree-view/useTreeItem' {
  interface UseTreeItemRootSlotOwnProps extends UseTreeItemRootSlotPropsFromItemsReordering {}

  interface UseTreeItemContentSlotOwnProps extends UseTreeItemContentSlotPropsFromItemsReordering {}

  interface UseTreeItemDragAndDropOverlaySlotOwnProps extends UseTreeItemDragAndDropOverlaySlotPropsFromItemsReordering {}
}
