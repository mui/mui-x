import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem2 } from '@mui/x-tree-view/TreeItem2';
import { MUI_X_PRODUCTS } from './products';

export default function EditingCallback() {
  const [lastEditedItem, setLastEditedItem] = React.useState(null);

  return (
    <Stack spacing={2} sx={{ width: 400 }}>
      <Typography>{lastEditedItem || 'No item has been edited yet'}</Typography>
      <Box sx={{ minHeight: 352, minWidth: 250 }}>
        <RichTreeView
          items={MUI_X_PRODUCTS}
          slots={{ item: TreeItem2 }}
          isItemEditable={() => true}
          defaultExpandedItems={['grid', 'pickers']}
          onItemLabelChange={(itemId, label) => {
            setLastEditedItem(
              `The label of item ${itemId} has been edited to ${label}`,
            );
          }}
        />
      </Box>
    </Stack>
  );
}
