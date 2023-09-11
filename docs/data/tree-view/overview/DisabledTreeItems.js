import * as React from 'react';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FormControlLabel from '@mui/material/FormControlLabel';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

export default function DisabledTreeItems() {
  const [focusDisabledItems, setFocusDisabledItems] = React.useState(false);
  const handleToggle = (event) => {
    setFocusDisabledItems(event.target.checked);
  };

  return (
    <Box sx={{ minHeight: 220, flexGrow: 1, maxWidth: 300 }}>
      <Box sx={{ mb: 1 }}>
        <FormControlLabel
          control={
            <Switch
              checked={focusDisabledItems}
              onChange={handleToggle}
              name="focusDisabledItems"
            />
          }
          label="Focus disabled items"
        />
      </Box>
      <TreeView
        aria-label="disabled items"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        disabledItemsFocusable={focusDisabledItems}
        multiSelect
      >
        <TreeItem nodeId="1" label="Applications">
          <TreeItem nodeId="2" label="Calendar" />
        </TreeItem>
        <TreeItem nodeId="11" label="Blog" disabled />
        <TreeItem nodeId="5" label="Documents">
          <TreeItem nodeId="10" label="OSS" />
          <TreeItem nodeId="6" label="MUI">
            <TreeItem nodeId="8" label="index.js" />
          </TreeItem>
        </TreeItem>
      </TreeView>
    </Box>
  );
}
