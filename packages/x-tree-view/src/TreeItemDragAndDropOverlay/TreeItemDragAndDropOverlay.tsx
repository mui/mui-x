'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import { shouldForwardProp } from '@mui/system';
import { TreeItemDragAndDropOverlayProps } from './TreeItemDragAndDropOverlay.types';
import { TreeViewItemsReorderingAction } from '../models';
import { styled } from '../internals/zero-styled';

const TreeItemDragAndDropOverlayRoot = styled('div', {
  name: 'MuiTreeItemDragAndDropOverlay',
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

function TreeItemDragAndDropOverlay(props: TreeItemDragAndDropOverlayProps) {
  if (props.action == null) {
    return null;
  }

  return <TreeItemDragAndDropOverlayRoot {...props} />;
}

TreeItemDragAndDropOverlay.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  action: PropTypes.oneOf(['make-child', 'move-to-parent', 'reorder-above', 'reorder-below']),
  style: PropTypes.object,
} as any;

export { TreeItemDragAndDropOverlay };
