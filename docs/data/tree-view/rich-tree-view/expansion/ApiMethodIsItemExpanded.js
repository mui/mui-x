import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useRichTreeViewApiRef } from '@mui/x-tree-view/hooks';
import { MUI_X_PRODUCTS } from '../../datasets/products';

export default function ApiMethodIsItemExpanded() {
  const apiRef = useRichTreeViewApiRef();
  const [isGridExpanded, setIsGridExpanded] = React.useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = React.useState(false);

  const checkExpansion = () => {
    setIsGridExpanded(apiRef.current.isItemExpanded('grid'));
    setIsSnackbarOpen(true);
  };

  return (
    <Stack spacing={2} sx={{ position: 'relative' }}>
      <Stack spacing={2} direction="row">
        <Button onClick={checkExpansion}>
          Check if the the Data Grid is expanded
        </Button>
        <Snackbar
          open={isSnackbarOpen}
          autoHideDuration={3000}
          onClose={() => setIsSnackbarOpen(false)}
          message={`Data Grid is ${isGridExpanded ? 'expanded' : 'collapsed'}`}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          sx={{ position: 'absolute' }}
        />
      </Stack>
      <Box sx={{ minHeight: 352, minWidth: 250 }}>
        <RichTreeView items={MUI_X_PRODUCTS} apiRef={apiRef} />
      </Box>
    </Stack>
  );
}
