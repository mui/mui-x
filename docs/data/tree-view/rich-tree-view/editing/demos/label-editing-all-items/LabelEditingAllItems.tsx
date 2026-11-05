import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { MUI_X_PRODUCTS } from '../../../../datasets/products';

export default function LabelEditingAllItems() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 260 }}>
      {/* @focus-start */}
      <RichTreeView
        items={MUI_X_PRODUCTS}
        isItemEditable
        defaultExpandedItems={['grid', 'pickers']}
      />
      {/* @focus-end */}
    </Box>
  );
}
