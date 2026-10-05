import Box from '@mui/material/Box';
import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';
import { useRichTreeViewProApiRef } from '@mui/x-tree-view-pro/hooks';
import { MUI_X_PRODUCTS } from '../../datasets/products';

export default function OnlyReorderLeaves() {
  const apiRef = useRichTreeViewProApiRef();

  return (
    <Box sx={{ minHeight: 352, minWidth: 300 }}>
      <RichTreeViewPro
        items={MUI_X_PRODUCTS}
        itemsReordering
        defaultExpandedItems={['grid', 'pickers']}
        apiRef={apiRef}
        isItemReorderable={(itemId) =>
          apiRef.current!.getItemOrderedChildrenIds(itemId).length === 0
        }
      />
    </Box>
  );
}
