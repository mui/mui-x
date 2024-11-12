import * as React from 'react';
import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem, TreeItemProps } from '@mui/x-tree-view/TreeItem';
import { useTreeItemModel } from '@mui/x-tree-view/hooks';
import { MUI_X_PRODUCTS } from './products';

type TreeItemWithLabel = {
  id: string;
  label: string;
  isHighlighted?: boolean;
};

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
