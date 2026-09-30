import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

import { useRichTreeViewApiRef } from '@mui/x-tree-view/hooks';
import { MUI_X_PRODUCTS } from '../../datasets/products';

export default function ApiMethodGetItemSelection() {
  const apiRef = useRichTreeViewApiRef();
  const [gridSelection, setGridSelection] = React.useState('unselected');
  const [isSnackbarOpen, setIsSnackbarOpen] = React.useState(false);

  const checkSelection = () => {
    setGridSelection(apiRef.current.getItemSelection('grid'));
    setIsSnackbarOpen(true);
  };

  return (
    <Stack spacing={2} sx={{ position: 'relative' }}>
      <Stack spacing={2} direction="row">
        <Button onClick={checkSelection}>
          Check the Data Grid selection status
        </Button>
        <Snackbar
          open={isSnackbarOpen}
          autoHideDuration={3000}
          onClose={() => setIsSnackbarOpen(false)}
          message={`Data Grid is ${gridSelection}`}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          sx={{ position: 'absolute' }}
        />
      </Stack>
      <Box sx={{ minHeight: 352, minWidth: 250 }}>
        <RichTreeView
          items={MUI_X_PRODUCTS}
          apiRef={apiRef}
          multiSelect
          checkboxSelection
          defaultExpandedItems={['grid']}
          defaultSelectedItems={['grid-pro']}
        />
      </Box>
    </Stack>
  );
}
