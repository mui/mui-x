import * as React from 'react';
import Box from '@mui/material/Box';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { SimpleTreeItem } from '@mui/x-tree-view/SimpleTreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export default function BasicJSXTreeView() {
  return (
    <Box sx={{ height: 168, flexGrow: 1, maxWidth: 400 }}>
      <SimpleTreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        <SimpleTreeItem nodeId="grid" label="Data Grid">
          <SimpleTreeItem nodeId="grid-community" label="@mui/x-data-grid" />
          <SimpleTreeItem nodeId="grid-pro" label="@mui/x-data-grid-pro" />
          <SimpleTreeItem nodeId="grid-premium" label="@mui/x-data-grid-premium" />
        </SimpleTreeItem>
        <SimpleTreeItem nodeId="pickers" label="Date and Time Pickers">
          <SimpleTreeItem nodeId="pickers-community" label="@mui/x-date-pickers" />
          <SimpleTreeItem nodeId="pickers-pro" label="@mui/x-date-pickers-pro" />
        </SimpleTreeItem>
      </SimpleTreeView>
    </Box>
  );
}
