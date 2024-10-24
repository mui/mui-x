import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import {
  TreeItem,
  TreeItemContent,
  TreeItemGroupTransition,
  TreeItemProps,
} from '@mui/x-tree-view/TreeItem';
import {
  UseTreeItemContentSlotOwnProps,
  UseTreeItemStatus,
} from '@mui/x-tree-view/useTreeItem';

const MUI_X_PRODUCTS = [
  {
    id: 'grid',
    label: 'Data Grid',
    children: [
      { id: 'grid-community', label: '@mui/x-data-grid' },
      { id: 'grid-pro', label: '@mui/x-data-grid-pro' },
      { id: 'grid-premium', label: '@mui/x-data-grid-premium' },
    ],
  },
  {
    id: 'pickers',
    label: 'Date and Time Pickers',
    children: [
      { id: 'pickers-community', label: '@mui/x-date-pickers' },
      { id: 'pickers-pro', label: '@mui/x-date-pickers-pro' },
    ],
  },
  {
    id: 'charts',
    label: 'Charts',
    children: [{ id: 'charts-community', label: '@mui/x-charts' }],
  },
  {
    id: 'tree-view',
    label: 'Tree View',
    children: [{ id: 'tree-view-community', label: '@mui/x-tree-view' }],
  },
];

const CustomTreeItemContent = styled(TreeItemContent)(({ theme }) => ({
  // Remove the additional padding of nested elements
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  width: '100%',
  border: '1px solid',
  display: 'flex',
  '&:hover': {
    backgroundColor: alpha((theme.vars || theme).palette.primary.main, 0.2),
  },
  variants: [
    {
      props: ({ status }: UseTreeItemContentSlotOwnProps) => status.disabled,
      style: {
        opacity: 0.5,
        backgroundColor: theme.palette.action.disabledBackground,
      },
    },
    {
      props: ({ status }: UseTreeItemContentSlotOwnProps) => status.selected,
      style: {
        backgroundColor: alpha((theme.vars || theme).palette.primary.main, 0.4),
      },
    },
  ],
}));

const CustomTreeItemGroupTransition = styled(TreeItemGroupTransition)({
  // Add the padding back on the group transition element
  paddingLeft: 'var(--TreeView-itemChildrenIndentation) !important',
});

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: TreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  return (
    <TreeItem
      {...props}
      ref={ref}
      slots={{
        content: CustomTreeItemContent,
        groupTransition: CustomTreeItemGroupTransition,
      }}
    />
  );
});

export default function ItemIndentationWithBorder() {
  return (
    <Stack sx={{ minHeight: 200, minWidth: 350 }} spacing={2}>
      <RichTreeView
        defaultExpandedItems={['pickers']}
        items={MUI_X_PRODUCTS}
        slots={{
          item: CustomTreeItem,
        }}
      />
    </Stack>
  );
}
