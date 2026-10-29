import * as React from 'react';
import Box from '@mui/material/Box';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import type { TreeItemProps, TreeItemSlotProps } from '@mui/x-tree-view/TreeItem';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { MUI_X_PRODUCTS } from '../../../datasets/disabledAndEditableProducts';

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: TreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  return (
    <TreeItem
      {...props}
      ref={ref}
      slotProps={
        {
          checkbox: {
            size: 'small',
            icon: <FavoriteBorder />,
            checkedIcon: <Favorite />,
          },
        } as TreeItemSlotProps
      }
    />
  );
});

export default function CheckboxSlotProps() {
  return (
    <Box sx={{ minHeight: 200, minWidth: 350 }}>
      {/* @focus-start */}
      <RichTreeView
        defaultExpandedItems={['grid', 'pickers']}
        checkboxSelection
        items={MUI_X_PRODUCTS}
        slots={{ item: CustomTreeItem }}
      />
      {/* @focus-end */}
    </Box>
  );
}
