import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useTreeViewApiRef } from '@mui/x-tree-view/hooks';
import { MUI_X_PRODUCTS } from './products';

export default function GetParentIdPublicAPI() {
  const apiRef = useTreeViewApiRef();
  const [selectedItemParent, setSelectedItemParent] = React.useState<
    string | null
  >();

  const handleSelectedItemsChange = (
    _event: React.SyntheticEvent | null,
    id: string | null,
  ) => {
    if (id) {
      const parentId = apiRef.current?.getParentId(id);
      if (parentId) {
        setSelectedItemParent(parentId);
        return;
      }
    }
    setSelectedItemParent(null);
  };

  return (
    <Stack spacing={2}>
      {selectedItemParent ? (
        <Alert severity="info">
          Selected child of <em>{selectedItemParent}</em>
        </Alert>
      ) : (
        <Alert severity="info">No child node selected</Alert>
      )}

      <Box sx={{ minHeight: 352, minWidth: 250 }}>
        <RichTreeView
          apiRef={apiRef}
          items={MUI_X_PRODUCTS}
          defaultSelectedItems="tree-view"
          onSelectedItemsChange={handleSelectedItemsChange}
        />
      </Box>
    </Stack>
  );
}
