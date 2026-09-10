import Box from '@mui/material/Box';
import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';
import { MUI_X_PRODUCTS } from '../datasets/products';

export default function BasicRichTreeViewPro() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      <RichTreeViewPro items={MUI_X_PRODUCTS} />
    </Box>
  );
}
