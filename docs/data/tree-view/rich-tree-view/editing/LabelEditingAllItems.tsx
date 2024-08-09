import * as React from 'react';
import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { MUI_X_PRODUCTS } from './products';

export default function LabelEditingAllItems() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 260 }}>
      <RichTreeView
        items={MUI_X_PRODUCTS}
        isItemEditable
        experimentalFeatures={{ labelEditing: true }}
        defaultExpandedItems={['grid', 'pickers']}
      />
    </Box>
  );
}
