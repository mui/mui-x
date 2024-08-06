import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { MUI_X_PRODUCTS } from './products';

export default function EditingCallback() {
  const [lastEditedItem, setLastEditedItem] = React.useState<{
    itemId: string;
    label: string;
  } | null>(null);

  return (
    <Stack spacing={2} sx={{ width: 400 }}>
      {lastEditedItem ? (
        <Typography>
          The label of item with id <em>{lastEditedItem!.itemId}</em> has been edited
          to <em>{lastEditedItem!.label}</em>
        </Typography>
      ) : (
        <Typography>No item has been edited yet</Typography>
      )}
      <Box sx={{ minHeight: 352, minWidth: 260 }}>
        <RichTreeView
          items={MUI_X_PRODUCTS}
          experimentalFeatures={{ labelEditing: true }}
          isItemEditable
          defaultExpandedItems={['grid', 'pickers']}
          onItemLabelChange={(itemId, label) => setLastEditedItem({ itemId, label })}
        />
      </Box>
    </Stack>
  );
}
