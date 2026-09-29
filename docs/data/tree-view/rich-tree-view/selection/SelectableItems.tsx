import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeViewDefaultItemModelProperties } from '@mui/x-tree-view/models';
import { MUI_X_PRODUCTS } from '../../datasets/products';

const isItemSelectionDisabled = (item: TreeViewDefaultItemModelProperties) =>
  !!item.children && item.children.length > 0;

export default function SelectableItems() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 290 }}>
      <RichTreeView
        items={MUI_X_PRODUCTS}
        defaultExpandedItems={['grid']}
        checkboxSelection
        isItemSelectionDisabled={isItemSelectionDisabled}
      />
    </Box>
  );
}
