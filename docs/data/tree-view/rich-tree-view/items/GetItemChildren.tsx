import Box from '@mui/material/Box';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

type MuiXProduct = TreeViewBaseItem<{
  id: string;
  label: string;
  nodes?: TreeViewBaseItem[];
}>;

const MUI_X_PRODUCTS: MuiXProduct[] = [
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

const getItemChildren = (item: MuiXProduct) => item.nodes;

export default function GetItemChildren() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      <RichTreeView items={MUI_X_PRODUCTS} getItemChildren={getItemChildren} />
    </Box>
  );
}
