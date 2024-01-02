import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeViewBaseItem, TreeViewItemId } from '@mui/x-tree-view/models';

const MUI_X_PRODUCTS: TreeViewBaseItem[] = [
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

const getAllItemWithChildrenNodeIds = () => {
  const nodeIds: TreeViewItemId[] = [];
  const registerNodeId = (item: TreeViewBaseItem) => {
    if (item.children?.length) {
      nodeIds.push(item.id);
      item.children.forEach(registerNodeId);
    }
  };

  MUI_X_PRODUCTS.forEach(registerNodeId);

  return nodeIds;
};

export default function ControlledExpansion() {
  const [expanded, setExpanded] = React.useState<string[]>([]);

  const handleToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
    setExpanded(nodeIds);
  };

  const handleExpandClick = () => {
    setExpanded((oldExpanded) =>
      oldExpanded.length === 0 ? getAllItemWithChildrenNodeIds() : [],
    );
  };

  return (
    <Box sx={{ flexGrow: 1, maxWidth: 400 }}>
      <Box sx={{ mb: 1 }}>
        <Button onClick={handleExpandClick}>
          {expanded.length === 0 ? 'Expand all' : 'Collapse all'}
        </Button>
      </Box>
      <Box sx={{ height: 264, flexGrow: 1 }}>
        <RichTreeView
          items={MUI_X_PRODUCTS}
          expanded={expanded}
          onNodeToggle={handleToggle}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        />
      </Box>
    </Box>
  );
}
