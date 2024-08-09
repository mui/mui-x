import * as React from 'react';
import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { MUI_X_PRODUCTS } from './editableProducts';

export default function LabelEditingSomeItems() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 260 }}>
      <RichTreeView
        items={MUI_X_PRODUCTS}
        isItemEditable={(item) => Boolean(item?.editable)}
        experimentalFeatures={{ labelEditing: true }}
        defaultExpandedItems={['grid', 'pickers']}
      />
    </Box>
  );
}
