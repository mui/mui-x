import * as React from 'react';
import { alpha } from '@mui/material/styles';
import { shouldForwardProp } from '@mui/system';
import { TreeItem2DragAndDropOverlayProps } from './TreeItem2DragAndDropOverlay.types';
import { TreeViewItemsReorderingAction } from '../models';
import { styled } from '../internals/zero-styled';

const TreeItem2DragAndDropOverlayRoot = styled('div', {
  name: 'MuiTreeItem2DragAndDropOverlay',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
  shouldForwardProp: (prop) => shouldForwardProp(prop) && prop !== 'action',
})<{ action?: TreeViewItemsReorderingAction | null }>(({ theme }) => ({
  position: 'absolute',
  left: 0,
  display: 'flex',
  top: 0,
  bottom: 0,
  right: 0,
  pointerEvents: 'none',
  variants: [
    {
      props: { action: 'make-child' },
      style: {
        marginLeft: 'calc(var(--TreeView-indentMultiplier) * var(--TreeView-itemDepth))',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha((theme.vars || theme).palette.primary.dark, 0.15),
      },
    },
    {
      props: { action: 'reorder-above' },
      style: {
        marginLeft: 'calc(var(--TreeView-indentMultiplier) * var(--TreeView-itemDepth))',
        borderTop: `1px solid ${alpha((theme.vars || theme).palette.grey[900], 0.6)}`,
        ...theme.applyStyles('dark', {
          borderTopColor: alpha((theme.vars || theme).palette.grey[100], 0.6),
        }),
      },
    },
    {
      props: { action: 'reorder-below' },
      style: {
        marginLeft: 'calc(var(--TreeView-indentMultiplier) * var(--TreeView-itemDepth))',
        borderBottom: `1px solid ${alpha((theme.vars || theme).palette.grey[900], 0.6)}`,
        ...theme.applyStyles('dark', {
          borderBottomColor: alpha((theme.vars || theme).palette.grey[100], 0.6),
        }),
      },
    },
    {
      props: { action: 'move-to-parent' },
      style: {
        marginLeft:
          'calc(var(--TreeView-indentMultiplier) * calc(var(--TreeView-itemDepth) - 1))' as any,
        borderBottom: `1px solid ${alpha((theme.vars || theme).palette.grey[900], 0.6)}`,
        ...theme.applyStyles('dark', {
          borderBottomColor: alpha((theme.vars || theme).palette.grey[900], 0.6),
        }),
      },
    },
  ],
}));

function TreeItem2DragAndDropOverlay(props: TreeItem2DragAndDropOverlayProps) {
  if (props.action == null) {
    return null;
  }

  return <TreeItem2DragAndDropOverlayRoot {...props} />;
}

export { TreeItem2DragAndDropOverlay };
