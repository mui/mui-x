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
        backgroundColor: theme.vars
          ? `rgba(${theme.vars.palette.primary.darkChannel} / ${theme.vars.palette.action.focusOpacity})`
          : alpha(theme.palette.primary.dark, theme.palette.action.focusOpacity),
      },
    },
    {
      props: { action: 'reorder-above' },
      style: {
        marginLeft: 'calc(var(--TreeView-indentMultiplier) * var(--TreeView-itemDepth))',
        borderTop: `1px solid ${(theme.vars || theme).palette.action.active}`,
      },
    },
    {
      props: { action: 'reorder-below' },
      style: {
        marginLeft: 'calc(var(--TreeView-indentMultiplier) * var(--TreeView-itemDepth))',
        borderBottom: `1px solid ${(theme.vars || theme).palette.action.active}`,
      },
    },
    {
      props: { action: 'move-to-parent' },
      style: {
        marginLeft:
          'calc(var(--TreeView-indentMultiplier) * calc(var(--TreeView-itemDepth) - 1))' as any,
        borderBottom: `1px solid ${(theme.vars || theme).palette.action.active}`,
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
