import * as React from 'react';
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

export default function BasicDisabledJSXItems() {
  return (
    <Box sx={{ height: 312, flexGrow: 1, maxWidth: 400 }}>
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        <TreeItem nodeId="grid" label="Data Grid">
          z
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
        <TreeItem nodeId="scheduler" label="Sheduler" disabled>
          <TreeItem nodeId="scheduler-community" label="@mui/x-scheduler" />
        </TreeItem>
      </TreeView>
    </Box>
  );
}
