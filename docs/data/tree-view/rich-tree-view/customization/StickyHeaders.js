import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { treeItemClasses } from '@mui/x-tree-view/TreeItem';

const MUI_X_PRODUCTS = [
  {
    id: 'grid',
    label: 'Data Grid',
    children: [
      {
        id: 'grid-community',
        label: '@mui/x-data-grid',
        children: [
          { id: 'grid-community-1', label: 'DataGrid' },
          { id: 'grid-community-2', label: 'DataGridProps' },
        ],
      },
      {
        id: 'grid-pro',
        label: '@mui/x-data-grid-pro',
        children: [
          { id: 'grid-pro-1', label: 'DataGridPro' },
          { id: 'grid-pro-2', label: 'DataGridProProps' },
        ],
      },
      {
        id: 'grid-premium',
        label: '@mui/x-data-grid-premium',
        children: [
          { id: 'grid-premium-1', label: 'DataGridPremium' },
          { id: 'grid-premium-2', label: 'DataGridPremiumProps' },
        ],
      },
    ],
  },
  {
    id: 'pickers',
    label: 'Date and Time Pickers',
    children: [
      {
        id: 'pickers-community',
        label: '@mui/x-date-pickers',
        children: [
          { id: 'pickers-community-1', label: 'DatePicker' },
          { id: 'pickers-community-2', label: 'TimePicker' },
        ],
      },
      {
        id: 'pickers-pro',
        label: '@mui/x-date-pickers-pro',
        children: [
          { id: 'pickers-pro-1', label: 'DateRangePicker' },
          { id: 'pickers-pro-2', label: 'DateTimeRangePicker' },
        ],
      },
    ],
  },
  {
    id: 'charts',
    label: 'Charts',
    children: [
      {
        id: 'charts-community',
        label: '@mui/x-charts',
        children: [
          { id: 'charts-community-1', label: 'BarChart' },
          { id: 'charts-community-2', label: 'LineChart' },
        ],
      },
    ],
  },
  {
    id: 'tree-view',
    label: 'Tree View',
    children: [
      {
        id: 'tree-view-community',
        label: '@mui/x-tree-view',
        children: [
          { id: 'tree-view-community-1', label: 'SimpleTreeView' },
          { id: 'tree-view-community-2', label: 'RichTreeView' },
        ],
      },
    ],
  },
];

// One level of indentation, must match the depth used in `top` below.
const ITEM_HEIGHT = 32;

const StickyRichTreeView = styled(RichTreeView)(({ theme }) => ({
  // Expanded items stick to the top of the scroll container while any of
  // their descendants are visible, stacking deeper levels below shallower
  // ones thanks to `--TreeView-itemDepth`.
  [`& .${treeItemClasses.content}[data-expanded]`]: {
    position: 'sticky',
    top: `calc(var(--TreeView-itemDepth) * ${ITEM_HEIGHT}px)`,
    zIndex: 'calc(100 - var(--TreeView-itemDepth))',
    // Use a solid, theme-aware background instead of an alpha color so
    // stacked sticky headers don't show the items scrolling behind them.
    backgroundColor: (theme.vars ?? theme).palette.background.paper,
  },
}));

export default function StickyHeaders() {
  return (
    <Box sx={{ height: 352, width: 280, overflowY: 'auto' }}>
      <StickyRichTreeView
        items={MUI_X_PRODUCTS}
        defaultExpandedItems={[
          'grid',
          'grid-community',
          'grid-pro',
          'grid-premium',
          'pickers',
          'pickers-community',
          'pickers-pro',
          'charts',
          'charts-community',
          'tree-view',
          'tree-view-community',
        ]}
      />
    </Box>
  );
}
