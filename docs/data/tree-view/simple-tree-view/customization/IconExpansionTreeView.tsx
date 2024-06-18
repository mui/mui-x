import * as React from 'react';
import Box from '@mui/material/Box';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem2 } from '@mui/x-tree-view/TreeItem2';

export default function IconExpansionTreeView() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      <SimpleTreeView aria-label="icon expansion" expansionTrigger="iconContainer">
        <TreeItem2 itemId="grid" label="Data Grid">
          <TreeItem2 itemId="grid-community" label="@mui/x-data-grid" />
          <TreeItem2 itemId="grid-pro" label="@mui/x-data-grid-pro" />
          <TreeItem2 itemId="grid-premium" label="@mui/x-data-grid-premium" />
        </TreeItem2>
        <TreeItem2 itemId="pickers" label="Date and Time Pickers">
          <TreeItem2 itemId="pickers-community" label="@mui/x-date-pickers" />
          <TreeItem2 itemId="pickers-pro" label="@mui/x-date-pickers-pro" />
        </TreeItem2>
        <TreeItem2 itemId="charts" label="Charts">
          <TreeItem2 itemId="charts-community" label="@mui/x-charts" />
        </TreeItem2>
        <TreeItem2 itemId="tree-view" label="Tree View">
          <TreeItem2 itemId="tree-view-community" label="@mui/x-tree-view" />
        </TreeItem2>
      </SimpleTreeView>
    </Box>
  );
}
