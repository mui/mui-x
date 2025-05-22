import * as React from 'react';
import Box from '@mui/material/Box';

import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

const MUI_X_PRODUCTS = [
  {
    id: 'grid',
    label: 'Data Grid',
    nodes: [
      { id: 'grid-community', label: '@mui/x-data-grid' },
      { id: 'grid-pro', label: '@mui/x-data-grid-pro' },
      { id: 'grid-premium', label: '@mui/x-data-grid-premium' },
    ],
  },
  {
    id: 'pickers',
    label: 'Date and Time Pickers',
    nodes: [
      { id: 'pickers-community', label: '@mui/x-date-pickers' },
      { id: 'pickers-pro', label: '@mui/x-date-pickers-pro' },
    ],
  },
  {
    id: 'charts',
    label: 'Charts',
    nodes: [{ id: 'charts-community', label: '@mui/x-charts' }],
  },
  {
    id: 'tree-view',
    label: 'Tree View',
    nodes: [{ id: 'tree-view-community', label: '@mui/x-tree-view' }],
  },
];

const getItemChildren = (item) => item.nodes;

export default function GetItemChildren() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      <RichTreeView items={MUI_X_PRODUCTS} getItemChildren={getItemChildren} />
    </Box>
  );
}
