import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import Typography from '@mui/material/Typography';
import MUI_X_PRODUCTS from '../../datasets/mui-x-products';

export default function TrackItemExpansionToggle() {
  const [action, setAction] = React.useState(null);

  const handleItemExpansionToggle = (event, itemId, isExpanded) => {
    setAction({ itemId, isExpanded });
  };

  return (
    <Stack spacing={2}>
      {action == null ? (
        <Typography>No action recorded</Typography>
      ) : (
        <Typography>
          Last action: {action.isExpanded ? 'expand' : 'collapse'} {action.itemId}
        </Typography>
      )}

      <Box sx={{ minHeight: 200, minWidth: 300, flexGrow: 1 }}>
        <RichTreeView
          items={MUI_X_PRODUCTS}
          onItemExpansionToggle={handleItemExpansionToggle}
        />
      </Box>
    </Stack>
  );
}
