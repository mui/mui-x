import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { useSimpleTreeViewApiRef } from '@mui/x-tree-view/hooks';

export default function ApiMethodIsItemExpanded() {
  const apiRef = useSimpleTreeViewApiRef();
  const [isGridExpanded, setIsGridExpanded] = React.useState<boolean>(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = React.useState(false);

  const checkExpansion = () => {
    setIsGridExpanded(apiRef.current!.isItemExpanded('grid'));
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
        <SimpleTreeView apiRef={apiRef}>
          <TreeItem itemId="grid" label="Data Grid">
            <TreeItem itemId="grid-community" label="@mui/x-data-grid" />
            <TreeItem itemId="grid-pro" label="@mui/x-data-grid-pro" />
            <TreeItem itemId="grid-premium" label="@mui/x-data-grid-premium" />
          </TreeItem>
          <TreeItem itemId="pickers" label="Date and Time Pickers">
            <TreeItem itemId="pickers-community" label="@mui/x-date-pickers" />
            <TreeItem itemId="pickers-pro" label="@mui/x-date-pickers-pro" />
          </TreeItem>
          <TreeItem itemId="charts" label="Charts">
            <TreeItem itemId="charts-community" label="@mui/x-charts" />
          </TreeItem>
          <TreeItem itemId="tree-view" label="Tree View">
            <TreeItem itemId="tree-view-community" label="@mui/x-tree-view" />
          </TreeItem>
        </SimpleTreeView>
      </Box>
    </Stack>
  );
}
