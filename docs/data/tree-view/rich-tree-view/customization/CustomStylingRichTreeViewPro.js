import Box from '@mui/material/Box';
import { styled, alpha } from '@mui/material/styles';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';

import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';

const MUI_X_PRODUCTS = [
  {
    id: 'grid',
    label: 'Data Grid',
    children: [
      { id: 'grid-community', label: '@mui/x-data-grid' },
      { id: 'grid-pro', label: '@mui/x-data-grid-pro' },
      { id: 'grid-premium', label: '@mui/x-data-grid-premium' },
    ],
  },
  {
    id: 'pickers',
    label: 'Date and Time Pickers',
    children: [
      { id: 'pickers-community', label: '@mui/x-date-pickers' },
      { id: 'pickers-pro', label: '@mui/x-date-pickers-pro' },
    ],
  },
  {
    id: 'charts',
    label: 'Charts',
    children: [{ id: 'charts-community', label: '@mui/x-charts' }],
  },
  {
    id: 'tree-view',
    label: 'Tree View',
    children: [{ id: 'tree-view-community', label: '@mui/x-tree-view' }],
  },
];

const ITEM_HEIGHT = 36;
const CONNECTOR_LINE_WIDTH = 1;
const CONNECTOR_LINE_CENTER = 17.5;
const CONNECTOR_LINE_LEFT = CONNECTOR_LINE_CENTER - CONNECTOR_LINE_WIDTH / 2;
const CONNECTOR_GAP = 16;
const CONNECTOR_OFFSET = CONNECTOR_LINE_WIDTH + CONNECTOR_GAP;
const ITEM_CHILDREN_INDENTATION =
  CONNECTOR_LINE_LEFT + CONNECTOR_LINE_WIDTH + CONNECTOR_GAP;

const CustomTreeItem = styled(TreeItem)(({ theme }) => {
  const rowSpacing = theme.spacing(0.25);

  return {
    position: 'relative',
    color: theme.palette.grey[200],
    '&::before': {
      content: '""',
      position: 'absolute',
      left: `calc(var(--TreeView-itemChildrenIndentation) * var(--TreeView-itemDepth) - ${CONNECTOR_OFFSET}px)`,
      top: 0,
      bottom: 0,
      borderLeft: `${CONNECTOR_LINE_WIDTH}px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
      opacity: 'clamp(0, var(--TreeView-itemDepth), 1)',
      pointerEvents: 'none',
    },
    [`& .${treeItemClasses.content}`]: {
      borderRadius: theme.spacing(0.5),
      height: `calc(var(--TreeView-itemHeight) - ${theme.spacing(0.5)})`,
      marginTop: rowSpacing,
      marginBottom: rowSpacing,
      marginLeft: `calc(var(--TreeView-itemChildrenIndentation) * var(--TreeView-itemDepth))`,
      width: `calc(100% - var(--TreeView-itemChildrenIndentation) * var(--TreeView-itemDepth))`,
      padding: theme.spacing(0.5, 1),
      [`& .${treeItemClasses.label}`]: {
        fontSize: '0.8rem',
        fontWeight: 500,
      },
    },
    [`& .${treeItemClasses.iconContainer}`]: {
      borderRadius: '50%',
      backgroundColor: theme.palette.primary.dark,
      padding: theme.spacing(0, 1.2),
      ...theme.applyStyles('light', {
        backgroundColor: alpha(theme.palette.primary.main, 0.25),
      }),
      ...theme.applyStyles('dark', {
        color: theme.palette.primary.contrastText,
      }),
    },
    ...theme.applyStyles('light', {
      color: theme.palette.grey[800],
    }),
  };
});

export default function CustomStylingRichTreeViewPro() {
  return (
    <Box sx={{ height: 352, minWidth: 250 }}>
      <RichTreeViewPro
        defaultExpandedItems={['grid']}
        itemChildrenIndentation={ITEM_CHILDREN_INDENTATION}
        itemHeight={ITEM_HEIGHT}
        slots={{ item: CustomTreeItem }}
        items={MUI_X_PRODUCTS}
      />
    </Box>
  );
}
