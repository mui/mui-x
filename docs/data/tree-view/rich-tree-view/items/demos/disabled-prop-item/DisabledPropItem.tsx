import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import type { MuiXProduct } from '../../../../datasets/disabledProducts';
import { MUI_X_PRODUCTS } from '../../../../datasets/disabledProducts';

const isItemDisabled = (item: MuiXProduct) => !!item.disabled;

export default function DisabledPropItem() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      {/** @focus */}
      <RichTreeView items={MUI_X_PRODUCTS} isItemDisabled={isItemDisabled} />
    </Box>
  );
}
