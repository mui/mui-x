import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { MUI_X_PRODUCTS, MuiXProduct } from '../../datasets/disabledProducts';

const isItemDisabled = (item: MuiXProduct) => !!item.disabled;

export default function DisabledPropItem() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      <RichTreeView items={MUI_X_PRODUCTS} isItemDisabled={isItemDisabled} />
    </Box>
  );
}
