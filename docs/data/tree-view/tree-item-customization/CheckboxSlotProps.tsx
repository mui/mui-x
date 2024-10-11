import * as React from 'react';
import Box from '@mui/material/Box';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import {
  TreeItem2,
  TreeItem2Props,
  TreeItem2SlotProps,
} from '@mui/x-tree-view/TreeItem2';
import { MUI_X_PRODUCTS } from './products';

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: TreeItem2Props,
  ref: React.Ref<HTMLLIElement>,
) {
  return (
    <TreeItem2
      {...props}
      ref={ref}
      slotProps={
        {
          checkbox: {
            size: 'small',
            icon: <FavoriteBorder />,
            checkedIcon: <Favorite />,
          },
        } as TreeItem2SlotProps
      }
    />
  );
});

export default function CheckboxSlotProps() {
  return (
    <Box sx={{ minHeight: 200, minWidth: 350 }}>
      <RichTreeView
        defaultExpandedItems={['grid', 'pickers']}
        checkboxSelection
        items={MUI_X_PRODUCTS}
        slots={{ item: CustomTreeItem }}
      />
    </Box>
  );
}
