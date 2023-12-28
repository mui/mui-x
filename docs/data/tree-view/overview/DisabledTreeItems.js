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
      <FormControlLabel
        control={
          <Switch
            checked={focusDisabledItems}
            onChange={handleToggle}
            name="focusDisabledItems"
          />
        }
        label="Focus disabled items"
        sx={{ mb: 1 }}
      />
      <TreeView
        aria-label="disabled items"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        disabledItemsFocusable={focusDisabledItems}
      >
        <TreeItem nodeId="1" label="Blog" disabled />
        <TreeItem nodeId="2" label="Documents">
          <TreeItem nodeId="3" label="OSS" disabled />
        </TreeItem>
      </TreeView>
    </Box>
  );
}
