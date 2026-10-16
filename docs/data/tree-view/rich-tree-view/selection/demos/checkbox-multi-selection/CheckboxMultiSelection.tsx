import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { MUI_X_PRODUCTS } from '../../../../datasets/products';

export default function CheckboxMultiSelection() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 290 }}>
      {/* @focus-start */}
      {/** @focus */}
      <RichTreeView multiSelect checkboxSelection items={MUI_X_PRODUCTS} />
      {/* @focus-end */}
    </Box>
  );
}
