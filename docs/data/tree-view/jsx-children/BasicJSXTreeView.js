import * as React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { SimpleTreeItem } from '@mui/x-tree-view/SimpleTreeItem';

export default function BasicJSXTreeView() {
  return (
    <SimpleTreeView
      aria-label="file system navigator"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
    >
      <SimpleTreeItem nodeId="grid" label="Data Grid">
        <SimpleTreeItem nodeId="grid-community" label="@mui/x-data-grid" />
        <SimpleTreeItem nodeId="grid-pro" label="@mui/x-data-grid-pro" />
        <SimpleTreeItem nodeId="grid-premium" label="@mui/x-data-grid-premium" />
      </SimpleTreeItem>
      <SimpleTreeItem nodeId="grid" label="Date and Time Pickers">
        <SimpleTreeItem nodeId="pickers-community" label="@mui/x-date-pickers" />
        <SimpleTreeItem nodeId="pickers-pro" label="@mui/x-date-pickers-pro" />
      </SimpleTreeItem>
      <SimpleTreeItem nodeId="charts" label="Charts">
        <SimpleTreeItem nodeId="charts-community" label="@mui/x-charts" />
      </SimpleTreeItem>
      <SimpleTreeItem nodeId="tree-view" label="Tree View">
        <SimpleTreeItem nodeId="tree-view-community" label="@mui/x-tree-view" />
      </SimpleTreeItem>
    </SimpleTreeView>
  );
}
