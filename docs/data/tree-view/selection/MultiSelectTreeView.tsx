import * as React from 'react';
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { TreeView, TreeViewBaseItem } from '@mui/x-tree-view';

const MUI_X_PRODUCTS: TreeViewBaseItem[] = [
  {
    nodeId: 'grid',
    label: 'Data Grid',
    children: [
      { nodeId: 'grid-community', label: '@mui/x-data-grid' },
      { nodeId: 'grid-pro', label: '@mui/x-data-grid-pro' },
      { nodeId: 'grid-premium', label: '@mui/x-data-grid-premium' },
    ],
  },
  {
    nodeId: 'pickers',
    label: 'Date and Time Pickers',
    children: [
      { nodeId: 'pickers-community', label: '@mui/x-date-pickers' },
      { nodeId: 'pickers-pro', label: '@mui/x-date-pickers-pro' },
    ],
  },
  {
    nodeId: 'charts',
    label: 'Charts',
    children: [{ nodeId: 'charts-community', label: '@mui/x-charts' }],
  },
  {
    nodeId: 'tree-view',
    label: 'Tree View',
    children: [{ nodeId: 'tree-view-community', label: '@mui/x-tree-view' }],
  },
];

export default function MultiSelectTreeView() {
  return (
    <Box sx={{ height: 264, flexGrow: 1, maxWidth: 400 }}>
      <TreeView
        multiSelect
        items={MUI_X_PRODUCTS}
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      />
    </Box>
  );
}
