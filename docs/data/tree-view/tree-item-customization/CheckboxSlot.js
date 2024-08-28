import * as React from 'react';
import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem2 } from '@mui/x-tree-view/TreeItem2';
import { MUI_X_PRODUCTS } from './products';

function CustomCheckbox(props) {
  return <input type="checkbox" {...props} />;
}

const CustomTreeItem = React.forwardRef(function CustomTreeItem(props, ref) {
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
    <Box sx={{ minHeight: 200, minWidth: 250 }}>
      <RichTreeView
        defaultExpandedItems={['grid', 'pickers']}
        checkboxSelection
        items={MUI_X_PRODUCTS}
        slots={{ item: CustomTreeItem }}
      />
    </Box>
  );
}
