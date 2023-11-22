import * as React from 'react';
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

export default function MultiSelectTreeView() {
  return (
    <Box sx={{ minHeight: 220, flexGrow: 1, maxWidth: 300 }}>
      <TreeView
        aria-label="multi-select"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        multiSelect
      >
        <TreeItem nodeId="1" label="Applications">
          <TreeItem nodeId="2" label="Calendar" />
          <TreeItem nodeId="3" label="Chrome" />
          <TreeItem nodeId="4" label="Webstorm" />
        </TreeItem>
        <TreeItem nodeId="5" label="Documents">
          <TreeItem nodeId="6" label="MUI">
            <TreeItem nodeId="7" label="src">
              <TreeItem nodeId="8" label="index.js" />
              <TreeItem nodeId="9" label="tree-view.js" />
            </TreeItem>
          </TreeItem>
        </TreeItem>
      </TreeView>
    </Box>
  );
}
