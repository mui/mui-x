import * as React from 'react';
import Box from '@mui/material/Box';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

type MuiXProduct = TreeViewBaseItem<{
  internalId: string;
  label: string;
}>;

const MUI_X_PRODUCTS: MuiXProduct[] = [
  {
    internalId: 'grid',
    label: 'Data Grid',
    children: [
      { internalId: 'grid-community', label: '@mui/x-data-grid' },
      { internalId: 'grid-pro', label: '@mui/x-data-grid-pro' },
      { internalId: 'grid-premium', label: '@mui/x-data-grid-premium' },
    ],
  },
  {
    internalId: 'pickers',
    label: 'Date and Time Pickers',
    children: [
      { internalId: 'pickers-community', label: '@mui/x-date-pickers' },
      { internalId: 'pickers-pro', label: '@mui/x-date-pickers-pro' },
    ],
  },
  {
    internalId: 'charts',
    label: 'Charts',
    children: [{ internalId: 'charts-community', label: '@mui/x-charts' }],
  },
  {
    internalId: 'tree-view',
    label: 'Tree View',
    children: [{ internalId: 'tree-view-community', label: '@mui/x-tree-view' }],
  },
];

const getItemId = (item: MuiXProduct) => item.internalId;

export default function GetItemId() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      <RichTreeView items={MUI_X_PRODUCTS} getItemId={getItemId} />
    </Box>
  );
}
