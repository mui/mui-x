import * as React from 'react';
import { styled } from '@mui/material/styles';
import { TreeItem2DragAndDropOverlayProps } from './TreeItem2DragAndDropOverlay.types';
import { useTreeViewContext } from '../internals/TreeViewProvider/useTreeViewContext';
import { UseTreeViewItemsReorderingSignature } from '../internals/plugins/useTreeViewItemsReordering';

const TreeItem2DragAndDropOverlayRoot = styled('div', {
  name: 'MuiTreeItem2DragAndDropOverlayRoot',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'red',
});

function TreeItem2DragAndDropOverlay(props: TreeItem2DragAndDropOverlayProps) {
  const { itemId } = props;

  const { itemsReordering } = useTreeViewContext<[UseTreeViewItemsReorderingSignature]>();

  if (!itemsReordering?.currentDrag || itemsReordering.currentDrag.draggedItemId === itemId) {
    return null;
  }

  return (
    <TreeItem2DragAndDropOverlayRoot
      sx={{ opacity: itemsReordering.currentDrag.targetItemId === itemId ? 0.3 : 0.1 }}
    />
  );
}

export { TreeItem2DragAndDropOverlay };
