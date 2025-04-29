import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useTreeViewApiRef } from '@mui/x-tree-view/hooks';
import { MUI_X_PRODUCTS } from './products';

export default function ApiMethodUpdateItemLabel() {
  const [isLabelUpdated, setIsLabelUpdated] = React.useState(false);
  const apiRef = useTreeViewApiRef();

  const handleUpdateLabel = () => {
    if (isLabelUpdated) {
      apiRef.current.updateItemLabel('grid', 'Data Grid');
      setIsLabelUpdated(false);
    } else {
      apiRef.current.updateItemLabel('grid', 'New Label');
      setIsLabelUpdated(true);
    }
  };

  return (
    <Stack spacing={2}>
      <Stack spacing={2} direction="row">
        <Button onClick={handleUpdateLabel}>
          {isLabelUpdated ? 'Reset Data Grid label' : 'Change Data Grid label'}
        </Button>
      </Stack>
      <Box sx={{ minHeight: 352, minWidth: 260 }}>
        <RichTreeView items={MUI_X_PRODUCTS} apiRef={apiRef} />
      </Box>
    </Stack>
  );
}
