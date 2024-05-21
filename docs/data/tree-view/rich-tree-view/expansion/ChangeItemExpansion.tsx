import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useTreeViewApiRef } from '@mui/x-tree-view/hooks';
import MUI_X_PRODUCTS from '../../datasets/mui-x-products';

export default function ChangeItemExpansion() {
  const apiRef = useTreeViewApiRef();

  const handleExpandClick = (event: React.MouseEvent) => {
    apiRef.current!.setItemExpansion(event, 'grid', true);
  };

  const handleCollapseClick = (event: React.MouseEvent) => {
    apiRef.current!.setItemExpansion(event, 'grid', false);
  };

  return (
    <Box sx={{ flexGrow: 1, maxWidth: 400 }}>
      <Stack sx={{ mb: 1 }} spacing={2} direction="row">
        <Button onClick={handleExpandClick}>Expand Data Grid</Button>
        <Button onClick={handleCollapseClick}>Collapse Data Grid</Button>
      </Stack>
      <Box sx={{ minHeight: 220, flexGrow: 1 }}>
        <RichTreeView items={MUI_X_PRODUCTS} apiRef={apiRef} />
      </Box>
    </Box>
  );
}
