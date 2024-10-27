import * as React from 'react';
import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { MUI_X_PRODUCTS } from './products';

const CustomCheckbox = React.forwardRef(function CustomCheckbox(props, ref) {
  return <input type="checkbox" ref={ref} {...props} />;
});

const CustomTreeItem = React.forwardRef(function CustomTreeItem(props, ref) {
  return (
    <TreeItem
      {...props}
      ref={ref}
      slots={{
        checkbox: CustomCheckbox,
      }}
    />
  );
});

export default function CheckboxSlot() {
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
