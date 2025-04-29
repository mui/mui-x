import * as React from 'react';
import Box from '@mui/material/Box';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

type MuiXProduct = TreeViewBaseItem<{
  id: string;
  name: string;
}>;

const MUI_X_PRODUCTS: MuiXProduct[] = [
  {
    id: 'grid',
    name: 'Data Grid',
    children: [
      { id: 'grid-community', name: '@mui/x-data-grid' },
      { id: 'grid-pro', name: '@mui/x-data-grid-pro' },
      { id: 'grid-premium', name: '@mui/x-data-grid-premium' },
    ],
  },
  {
    id: 'pickers',
    name: 'Date and Time Pickers',
    children: [
      { id: 'pickers-community', name: '@mui/x-date-pickers' },
      { id: 'pickers-pro', name: '@mui/x-date-pickers-pro' },
    ],
  },
  {
    id: 'charts',
    name: 'Charts',
    children: [{ id: 'charts-community', name: '@mui/x-charts' }],
  },
  {
    id: 'tree-view',
    name: 'Tree View',
    children: [{ id: 'tree-view-community', name: '@mui/x-tree-view' }],
  },
];

const getItemLabel = (item: MuiXProduct) => item.name;

export default function GetItemLabel() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      <RichTreeView items={MUI_X_PRODUCTS} getItemLabel={getItemLabel} />
    </Box>
  );
}
