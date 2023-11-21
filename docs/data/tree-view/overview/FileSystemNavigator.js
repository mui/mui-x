import * as React from 'react';
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { SimpleTreeItem } from 'packages/x-tree-view/src/SimpleTreeItem';

export default function FileSystemNavigator() {
  return (
    <Box sx={{ minHeight: 180, flexGrow: 1, maxWidth: 300 }}>
      <SimpleTreeView
        aria-label="file system navigator"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        <SimpleTreeItem nodeId="1" label="Applications">
          <SimpleTreeItem nodeId="2" label="Calendar" />
        </SimpleTreeItem>
        <SimpleTreeItem nodeId="5" label="Documents">
          <SimpleTreeItem nodeId="10" label="OSS" />
          <SimpleTreeItem nodeId="6" label="MUI">
            <SimpleTreeItem nodeId="8" label="index.js" />
          </SimpleTreeItem>
        </SimpleTreeItem>
      </SimpleTreeView>
    </Box>
  );
}
