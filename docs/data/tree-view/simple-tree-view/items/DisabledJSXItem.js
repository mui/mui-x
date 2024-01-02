import * as React from 'react';
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

export default function DisabledJSXItem() {
  return (
    <Box sx={{ height: 264, flexGrow: 1, maxWidth: 400 }}>
      <SimpleTreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
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
          <TreeItem nodeId="tree-view-pro" label="@mui/x-tree-view-pro" disabled />
        </TreeItem>
        <TreeItem nodeId="scheduler" label="Scheduler" disabled>
          <TreeItem nodeId="scheduler-community" label="@mui/x-scheduler" />
        </TreeItem>
      </SimpleTreeView>
    </Box>
  );
}
