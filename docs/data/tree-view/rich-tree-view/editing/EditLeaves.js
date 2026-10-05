import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useRichTreeViewApiRef } from '@mui/x-tree-view/hooks';
import { MUI_X_PRODUCTS } from '../../datasets/products';

export default function EditLeaves() {
  const apiRef = useRichTreeViewApiRef();
  return (
    <Box sx={{ minHeight: 352, minWidth: 260 }}>
      <RichTreeView
        items={MUI_X_PRODUCTS}
        apiRef={apiRef}
        isItemEditable={(item) =>
          apiRef.current.getItemOrderedChildrenIds(item.id).length === 0
        }
        defaultExpandedItems={['grid', 'pickers']}
      />
    </Box>
  );
}
