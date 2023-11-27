import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

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
    children: [{ nodeId: 'tree-view-community', label: '@mui/x-tree-view' }],
  },
];

const getAllItemNodeIds = () => {
  const nodeIds = [];
  const registerNodeId = (item) => {
    nodeIds.push(item.nodeId);
    item.children?.forEach(registerNodeId);
  };

  MUI_X_PRODUCTS.forEach(registerNodeId);

  return nodeIds;
};

export default function ControlledSelection() {
  const [selected, setSelected] = React.useState([]);

  const handleSelect = (event, nodeIds) => {
    setSelected(nodeIds);
  };

  const handleSelectClick = () => {
    setSelected((oldSelected) =>
      oldSelected.length === 0 ? getAllItemNodeIds() : [],
    );
  };

  return (
    <Box sx={{ flexGrow: 1, maxWidth: 400 }}>
      <Box sx={{ mb: 1 }}>
        <Button onClick={handleSelectClick}>
          {selected.length === 0 ? 'Select all' : 'Unselect all'}
        </Button>
      </Box>
      <Box sx={{ height: 264, flexGrow: 1 }}>
        <RichTreeView
          items={MUI_X_PRODUCTS}
          selected={selected}
          onNodeSelect={handleSelect}
          multiSelect
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        />
      </Box>
    </Box>
  );
}
