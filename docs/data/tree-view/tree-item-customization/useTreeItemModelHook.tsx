import * as React from 'react';
import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem, TreeItemProps } from '@mui/x-tree-view/TreeItem';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { useTreeItemModel } from '@mui/x-tree-view/hooks';

type TreeItemWithLabel = {
  id: string;
  label: string;
  isHighlighted?: boolean;
};

export const MUI_X_PRODUCTS: TreeViewBaseItem<TreeItemWithLabel>[] = [
  {
    id: 'grid',
    label: 'Data Grid',
    children: [
      {
        id: 'grid-community',
        label: '@mui/x-data-grid',
      },
      {
        id: 'grid-pro',
        label: '@mui/x-data-grid-pro',
      },
      {
        id: 'grid-premium',
        label: '@mui/x-data-grid-premium',
      },
    ],
  },
  {
    id: 'pickers',
    label: 'Date and Time pickers',
    children: [
      {
        id: 'pickers-community',
        label: '@mui/x-date-pickers',
      },
      {
        id: 'pickers-pro',
        label: '@mui/x-date-pickers-pro',
        isHighlighted: true,
      },
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

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: TreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  const item = useTreeItemModel<TreeItemWithLabel>(props.itemId)!;

  return (
    <TreeItem
      {...props}
      ref={ref}
      slotProps={{
        label: { style: item.isHighlighted ? { color: 'red' } : undefined } as any,
      }}
    />
  );
});

export default function useTreeItemModelHook() {
  return (
    <Box sx={{ minHeight: 200, minWidth: 350 }}>
      <RichTreeView
        defaultExpandedItems={['pickers']}
        items={MUI_X_PRODUCTS}
        slots={{ item: CustomTreeItem }}
      />
    </Box>
  );
}
