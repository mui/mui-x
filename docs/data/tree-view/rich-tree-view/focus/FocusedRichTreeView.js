import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useTreeViewApiRef } from '@mui/x-tree-view/hooks/useTreeViewApiRef';
import MUI_X_PRODUCTS from '../../datasets/mui-x-products';

export default function FocusedRichTreeView() {
  const apiRef = useTreeViewApiRef();
  const handleButtonClick = (event) => {
    apiRef.current?.focusItem(event, 'pickers');
  };

  return (
    <Box sx={{ flexGrow: 1, maxWidth: 400 }}>
      <Box sx={{ mb: 1 }}>
        <Button onClick={handleButtonClick}>Focus pickers item</Button>
      </Box>
      <Box sx={{ height: 264, flexGrow: 1 }}>
        <RichTreeView items={MUI_X_PRODUCTS} apiRef={apiRef} />
      </Box>
    </Box>
  );
}
