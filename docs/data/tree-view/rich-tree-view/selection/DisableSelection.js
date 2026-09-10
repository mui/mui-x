import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { MUI_X_PRODUCTS } from '../../datasets/products';

export default function DisableSelection() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      <RichTreeView disableSelection items={MUI_X_PRODUCTS} />
    </Box>
  );
}
