import * as React from 'react';
import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { MUI_X_PRODUCTS } from './products';

const CustomRadio = React.forwardRef(function CustomRadio(props, ref) {
  // `indeterminate` is ignored so that a parent with a selected descendant
  // keeps rendering an unchecked radio.
  const { visible, indeterminate, ...other } = props;
  if (!visible) {
    return null;
  }

  return <Radio {...other} ref={ref} size="small" sx={{ padding: 0 }} />;
});

const CustomTreeItem = React.forwardRef(function CustomTreeItem(props, ref) {
  return (
    <TreeItem
      {...props}
      ref={ref}
      slots={{
        checkbox: CustomRadio,
      }}
    />
  );
});

export default function CheckboxSlotRadio() {
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
