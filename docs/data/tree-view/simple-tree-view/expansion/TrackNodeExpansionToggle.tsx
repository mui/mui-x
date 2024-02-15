import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import Typography from '@mui/material/Typography';

export default function TrackNodeExpansionToggle() {
  const [action, setAction] = React.useState<{
    nodeId: string;
    isExpanded: boolean;
  } | null>(null);

  const handleNodeExpansionToggle = (
    event: React.SyntheticEvent,
    nodeId: string,
    isExpanded: boolean,
  ) => {
    setAction({ nodeId, isExpanded });
  };

  return (
    <Stack spacing={2}>
      {action == null ? (
        <Typography>No action recorded</Typography>
      ) : (
        <Typography>
          Last action: {action.isExpanded ? 'expand' : 'collapse'} {action.nodeId}
        </Typography>
      )}
      <Box sx={{ minHeight: 200, flexGrow: 1 }}>
        <SimpleTreeView onNodeExpansionToggle={handleNodeExpansionToggle}>
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
