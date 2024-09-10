import * as React from 'react';
import {
  MuiCancellableEvent,
  TreeViewItemPlugin,
  useTreeViewContext,
  UseTreeViewItemsSignature,
  isTargetInDescendants,
  useSelector,
} from '@mui/x-tree-view/internals';
import { TreeItem2Props } from '@mui/x-tree-view/TreeItem2';
import {
  UseTreeItem2DragAndDropOverlaySlotPropsFromItemsReordering,
  UseTreeItem2RootSlotPropsFromItemsReordering,
  UseTreeViewItemsReorderingSignature,
  TreeViewItemItemReorderingValidActions,
  UseTreeItem2ContentSlotPropsFromItemsReordering,
} from './useTreeViewItemsReordering.types';
import {
  selectorItemsReorderingForDraggedItem,
  selectorItemsReorderingIsValidTarget,
} from './useTreeViewItemsReordering.selectors';

export const isAndroid = () => navigator.userAgent.toLowerCase().includes('android');

export const useTreeViewItemsReorderingItemPlugin: TreeViewItemPlugin<TreeItem2Props> = ({
  props,
}) => {
  const { instance, store } =
    useTreeViewContext<[UseTreeViewItemsSignature, UseTreeViewItemsReorderingSignature]>();
  const { itemId } = props;

  const validActionsRef = React.useRef<TreeViewItemItemReorderingValidActions | null>(null);

  const itemsReorderingForDraggedItem = useSelector(store, (state) =>
    selectorItemsReorderingForDraggedItem(state, itemId),
  );
  const isValidTarget = useSelector(store, (state) =>
    selectorItemsReorderingIsValidTarget(state, itemId),
  );

  return {
    propsEnhancers: {
      root: ({
        rootRefObject,
        contentRefObject,
        externalEventHandlers,
      }): UseTreeItem2RootSlotPropsFromItemsReordering => {
        // TODO selectors: Remove
        const draggable = instance.canItemBeDragged(itemId);
        if (!draggable) {
          return {};
        }

        const handleDragStart = (event: React.DragEvent & MuiCancellableEvent) => {
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

        const handleRootDragOver = (event: React.DragEvent & MuiCancellableEvent) => {
          externalEventHandlers.onDragOver?.(event);
          if (event.defaultMuiPrevented) {
            return;
          }

          event.preventDefault();
        };

        const handleRootDragEnd = (event: React.DragEvent & MuiCancellableEvent) => {
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
      }): UseTreeItem2ContentSlotPropsFromItemsReordering => {
        if (!isValidTarget) {
          return {};
        }

        const handleDragOver = (event: React.DragEvent & MuiCancellableEvent) => {
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

        const handleDragEnter = (event: React.DragEvent & MuiCancellableEvent) => {
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
      dragAndDropOverlay: (): UseTreeItem2DragAndDropOverlaySlotPropsFromItemsReordering => {
        if (!itemsReorderingForDraggedItem) {
          return {};
        }

        return {
          action: itemsReorderingForDraggedItem.action,
          style: {
            '--TreeView-targetDepth': itemsReorderingForDraggedItem.targetDepth,
          } as React.CSSProperties,
        };
      },
    },
  };
};
