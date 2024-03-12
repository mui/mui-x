import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

export default function ControlledExpansion() {
  const [expandedItems, setExpandedItems] = React.useState([]);

  const handleExpandedItemsChange = (event, itemIds) => {
    setExpandedItems(itemIds);
  };

  const handleExpandClick = () => {
    setExpandedItems((oldExpanded) =>
      oldExpanded.length === 0
        ? [
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
          ]
        : [],
    );
  };

  return (
    <Box sx={{ flexGrow: 1, maxWidth: 400 }}>
      <Box sx={{ mb: 1 }}>
        <Button onClick={handleExpandClick}>
          {expandedItems.length === 0 ? 'Expand all' : 'Collapse all'}
        </Button>
      </Box>
      <Box sx={{ minHeight: 200, flexGrow: 1 }}>
        <SimpleTreeView
          expandedItems={expandedItems}
          onExpandedItemsChange={handleExpandedItemsChange}
        >
          <TreeItem nodeId="grid" label="Data Grid">
            <TreeItem nodeId="grid-community" label="@mui/x-data-grid" />
            <TreeItem nodeId="grid-pro" label="@mui/x-data-grid-pro" />
            <TreeItem nodeId="grid-premium" label="@mui/x-data-grid-premium" />
          </TreeItem>
          <TreeItem nodeId="pickers" label="Date and Time Pickers">
            <TreeItem nodeId="pickers-community" label="@mui/x-date-pickers" />
            <TreeItem nodeId="pickers-pro" label="@mui/x-date-pickers-pro" />
          </TreeItem>
          <TreeItem nodeId="charts" label="Charts">
            <TreeItem nodeId="charts-community" label="@mui/x-charts" />
          </TreeItem>
          <TreeItem nodeId="tree-view" label="Tree View">
            <TreeItem nodeId="tree-view-community" label="@mui/x-tree-view" />
          </TreeItem>
        </SimpleTreeView>
      </Box>
    </Box>
  );
}
