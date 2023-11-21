import * as React from 'react';
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { SimpleTreeItem } from 'packages/x-tree-view/src/SimpleTreeItem';

export default function MultiSelectTreeView() {
  return (
    <Box sx={{ minHeight: 220, flexGrow: 1, maxWidth: 300 }}>
      <SimpleTreeView
        aria-label="multi-select"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        multiSelect
      >
        <SimpleTreeItem nodeId="1" label="Applications">
          <SimpleTreeItem nodeId="2" label="Calendar" />
          <SimpleTreeItem nodeId="3" label="Chrome" />
          <SimpleTreeItem nodeId="4" label="Webstorm" />
        </SimpleTreeItem>
        <SimpleTreeItem nodeId="5" label="Documents">
          <SimpleTreeItem nodeId="6" label="MUI">
            <SimpleTreeItem nodeId="7" label="src">
              <SimpleTreeItem nodeId="8" label="index.js" />
              <SimpleTreeItem nodeId="9" label="tree-view.js" />
            </SimpleTreeItem>
          </SimpleTreeItem>
        </SimpleTreeItem>
      </SimpleTreeView>
    </Box>
  );
}
