import * as React from 'react';
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { SimpleTreeItem } from '@mui/x-tree-view/SimpleTreeItem';

export default function DisabledJSXItem() {
  return (
    <Box sx={{ height: 264, flexGrow: 1, maxWidth: 400 }}>
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
        <SimpleTreeItem nodeId="charts" label="Charts">
          <SimpleTreeItem nodeId="charts-community" label="@mui/x-charts" />
        </SimpleTreeItem>
        <SimpleTreeItem nodeId="tree-view" label="Tree View">
          <SimpleTreeItem nodeId="tree-view-community" label="@mui/x-tree-view" />
          <SimpleTreeItem
            nodeId="tree-view-pro"
            label="@mui/x-tree-view-pro"
            disabled
          />
        </SimpleTreeItem>
        <SimpleTreeItem nodeId="scheduler" label="Scheduler" disabled>
          <SimpleTreeItem nodeId="scheduler-community" label="@mui/x-scheduler" />
        </SimpleTreeItem>
      </SimpleTreeView>
    </Box>
  );
}
