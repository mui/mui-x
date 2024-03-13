import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { useTreeViewApiRef } from '@mui/x-tree-view/hooks/useTreeViewApiRef';

export default function FocusedSimpleTreeView() {
  const apiRef = useTreeViewApiRef();
  const handleButtonClick = (event) => {
    apiRef.current?.focusItem(event, 'pickers');
  };

  return (
    <Box sx={{ flexGrow: 1, maxWidth: 400 }}>
      <Box sx={{ mb: 1 }}>
        <Button onClick={handleButtonClick}>Focus pickers item</Button>
      </Box>
      <Box sx={{ minHeight: 264, flexGrow: 1 }}>
        <SimpleTreeView apiRef={apiRef}>
          <TreeItem nodeId="grid" label="Data Grid">
            <TreeItem nodeId="grid-community" label="@mui/x-data-grid" />
            <TreeItem nodeId="grid-pro" label="@mui/x-data-grid-pro" />
            <TreeItem nodeId="grid-premium" label="@mui/x-data-grid-premium" />
          </TreeItem>
          <TreeItem nodeId="pickers" label="Date and Time Pickers">
            <TreeItem nodeId="pickers-community" label="@mui/x-date-pickers" />
            <TreeItem nodeId="pickers-pro" label="@mui/x-date-pickers-pro" />
          </TreeItem>
          <TreeItem nodeId="charts" label="Charts">
            <TreeItem nodeId="charts-community" label="@mui/x-charts" />
          </TreeItem>
          <TreeItem nodeId="tree-view" label="Tree View">
            <TreeItem nodeId="tree-view-community" label="@mui/x-tree-view" />
          </TreeItem>
        </SimpleTreeView>
      </Box>
    </Box>
  );
}
