import * as React from 'react';
import { TreeViewCancellableEvent } from '@mui/x-tree-view/models';
import {
  TreeViewItemPlugin,
  useTreeViewContext,
  UseTreeViewItemsSignature,
  isTargetInDescendants,
  useSelector,
} from '@mui/x-tree-view/internals';
import {
  UseTreeItemDragAndDropOverlaySlotPropsFromItemsReordering,
  UseTreeItemRootSlotPropsFromItemsReordering,
  UseTreeViewItemsReorderingSignature,
  TreeViewItemItemReorderingValidActions,
  UseTreeItemContentSlotPropsFromItemsReordering,
} from './useTreeViewItemsReordering.types';
import {
  selectorItemsReorderingDraggedItemProperties,
  selectorItemsReorderingIsValidTarget,
} from './useTreeViewItemsReordering.selectors';

export const isAndroid = () => navigator.userAgent.toLowerCase().includes('android');

export const useTreeViewItemsReorderingItemPlugin: TreeViewItemPlugin = ({ props }) => {
  const { instance, store, itemsReordering } =
    useTreeViewContext<[UseTreeViewItemsSignature, UseTreeViewItemsReorderingSignature]>();
  const { itemId } = props;

  const validActionsRef = React.useRef<TreeViewItemItemReorderingValidActions | null>(null);

  const draggedItemProperties = useSelector(
    store,
    selectorItemsReorderingDraggedItemProperties,
    itemId,
  );
  const isValidTarget = useSelector(store, selectorItemsReorderingIsValidTarget, itemId);

  return {
    propsEnhancers: {
      root: ({
        rootRefObject,
        contentRefObject,
        externalEventHandlers,
      }): UseTreeItemRootSlotPropsFromItemsReordering => {
        if (
          !itemsReordering.enabled ||
          (itemsReordering.isItemReorderable && !itemsReordering.isItemReorderable(itemId))
        ) {
          return {};
        }

        const handleDragStart = (event: React.DragEvent & TreeViewCancellableEvent) => {
          externalEventHandlers.onDragStart?.(event);
          if (event.defaultMuiPrevented || event.defaultPrevented) {
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

          instance.startDraggingItem(itemId);
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

          instance.stopDraggingItem(itemId);
        };

        return {
          draggable: true,
          onDragStart: handleDragStart,
          onDragOver: handleRootDragOver,
          onDragEnd: handleRootDragEnd,
        };
      },
      content: ({
        externalEventHandlers,
        contentRefObject,
      }): UseTreeItemContentSlotPropsFromItemsReordering => {
        if (!isValidTarget) {
          return {};
        }

        const handleDragOver = (event: React.DragEvent & TreeViewCancellableEvent) => {
          externalEventHandlers.onDragOver?.(event);
          if (event.defaultMuiPrevented || validActionsRef.current == null) {
            return;
          }

          const rect = (event.target as HTMLDivElement).getBoundingClientRect();
          const y = event.clientY - rect.top;
          const x = event.clientX - rect.left;
          instance.setDragTargetItem({
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

          validActionsRef.current = instance.getDroppingTargetValidActions(itemId);
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
