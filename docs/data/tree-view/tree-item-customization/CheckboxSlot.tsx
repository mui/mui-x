import * as React from 'react';
import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem2, TreeItem2Props } from '@mui/x-tree-view/TreeItem2';
import { MUI_X_PRODUCTS } from './products';

const CustomCheckbox = React.forwardRef(function CustomCheckbox(
  props: React.InputHTMLAttributes<HTMLInputElement>,
  ref: React.Ref<HTMLInputElement>,
) {
  return <input type="checkbox" ref={ref} {...props} />;
});

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: TreeItem2Props,
  ref: React.Ref<HTMLLIElement>,
) {
  return (
    <TreeItem2
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
