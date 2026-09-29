import Box from '@mui/material/Box';
import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';
import { MUI_X_PRODUCTS } from '../../datasets/products';

export default function OnlyReorderInSameParent() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 300 }}>
      <RichTreeViewPro
        items={MUI_X_PRODUCTS}
        itemsReordering
        defaultExpandedItems={['grid', 'pickers']}
        canMoveItemToNewPosition={(params) =>
          params.oldPosition.parentId === params.newPosition.parentId
        }
      />
    </Box>
  );
}
