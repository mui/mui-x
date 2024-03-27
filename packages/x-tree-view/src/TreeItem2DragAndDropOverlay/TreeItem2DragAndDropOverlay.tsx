import * as React from 'react';
import { styled } from '@mui/material/styles';
import { shouldForwardProp } from '@mui/system';
import { TreeItem2DragAndDropOverlayProps } from './TreeItem2DragAndDropOverlay.types';
import { useTreeViewContext } from '../internals/TreeViewProvider/useTreeViewContext';
import {
  UseTreeViewItemsReorderingSignature,
  TreeViewItemsReorderingAction,
} from '../internals/plugins/useTreeViewItemsReordering';

const TreeItem2DragAndDropOverlayRoot = styled('div', {
  name: 'MuiTreeItem2DragAndDropOverlay',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
  shouldForwardProp: (prop) => shouldForwardProp(prop) && prop !== 'action' && prop !== 'isTarget',
})<{ action: TreeViewItemsReorderingAction | null; isTarget: boolean }>(({ theme }) => ({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  display: 'flex',
  flexDirection: 'column',
  variants: [
    {
      props: { isTarget: true, action: 'make-child' },
      style: {
        border: `2px dashed ${(theme.vars || theme).palette.primary.main}`,
      },
    },
    {
      props: { isTarget: true, action: 'reorder-above' },
      style: {
        borderTop: `2px dashed ${(theme.vars || theme).palette.primary.main}`,
      },
    },
    {
      props: { isTarget: true, action: 'reorder-below' },
      style: {
        borderBottom: `2px dashed ${(theme.vars || theme).palette.primary.main}`,
      },
    },
  ],
}));

function TreeItem2DragAndDropOverlay(props: TreeItem2DragAndDropOverlayProps) {
  const { itemId } = props;

  const { itemsReordering, instance } = useTreeViewContext<[UseTreeViewItemsReorderingSignature]>();

  if (!itemsReordering?.currentDrag || itemsReordering.currentDrag.draggedItemId === itemId) {
    return null;
  }

  // TODO: Support props.onDragOver and `defaultMuiPrevented`
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    const rect = (event.target as HTMLDivElement).getBoundingClientRect();
    // const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const validActions = instance.getItemTargetValidActions(itemId);

    let action: TreeViewItemsReorderingAction | null;

    // If we can move the item inside the target,
    // Then the upper quarter of the target moves it above,
    // the lower quarter moves it below and the rest makes a child.
    if (validActions['make-child']) {
      if (validActions['reorder-above'] && y < (1 / 4) * rect.height) {
        action = 'reorder-above';
      } else if (validActions['reorder-below'] && y > (3 / 4) * rect.height) {
        action = 'reorder-below';
      } else {
        action = 'make-child';
      }
    }
    // If we can't move the item inside the target,
    // Then the upper half of the target moves it above, and the lower half moves it below.
    else {
      // eslint-disable-next-line no-lonely-if
      if (validActions['reorder-above'] && y < (1 / 2) * rect.height) {
        action = 'reorder-above';
      } else if (validActions['reorder-below'] && y >= (1 / 2) * rect.height) {
        action = 'reorder-below';
      } else {
        action = null;
      }
    }

    instance.setDragTargetItem(itemId, action);
  };

  return (
    <TreeItem2DragAndDropOverlayRoot
      onDragOver={handleDragOver}
      action={itemsReordering.currentDrag.action}
      isTarget={itemsReordering.currentDrag.targetItemId === itemId}
    />
  );
}

export { TreeItem2DragAndDropOverlay };
