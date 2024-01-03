import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import Typography from '@mui/material/Typography';

export default function TrackNodeSelectionToggle() {
  const [lastSelectedNode, setLastSelectedNode] = React.useState<string | null>(
    null,
  );

  const handleNodeSelectionToggle = (
    event: React.SyntheticEvent,
    nodeId: string,
    isSelected: boolean,
  ) => {
    if (isSelected) {
      setLastSelectedNode(nodeId);
    }
  };

  return (
    <Stack spacing={2}>
      <Typography>
        {lastSelectedNode == null
          ? 'No node selection recorded'
          : `Last selected node: ${lastSelectedNode}`}
      </Typography>
      <Box sx={{ height: 264, flexGrow: 1 }}>
        <SimpleTreeView
          onNodeSelectionToggle={handleNodeSelectionToggle}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
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
    </Stack>
  );
}
