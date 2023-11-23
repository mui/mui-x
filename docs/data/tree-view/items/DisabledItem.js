import * as React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { TreeView } from '@mui/x-tree-view/TreeView';

const MUI_X_PRODUCTS = [
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
    children: [
      { nodeId: 'tree-view-community', label: '@mui/x-tree-view' },
      { nodeId: 'tree-view-pro', label: '@mui/x-tree-view-pro', disabled: true },
    ],
  },
  {
    nodeId: 'scheduler',
    label: 'Scheduler',
    disabled: true,
    children: [{ nodeId: 'scheduler-community', label: '@mui/x-scheduler' }],
  },
];

const isItemDisabled = (item) => !!item.disabled;

export default function DisabledItem() {
  return (
    <TreeView
      items={MUI_X_PRODUCTS}
      isItemDisabled={isItemDisabled}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{ height: 312, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
    />
  );
}
