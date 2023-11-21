import * as React from 'react';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FormControlLabel from '@mui/material/FormControlLabel';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { SimpleTreeItem } from '@mui/x-tree-view/SimpleTreeItem';

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
      <SimpleTreeView
        aria-label="disabled items"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        disabledItemsFocusable={focusDisabledItems}
        multiSelect
      >
        <SimpleTreeItem nodeId="1" label="Applications">
          <SimpleTreeItem nodeId="2" label="Calendar" />
        </SimpleTreeItem>
        <SimpleTreeItem nodeId="11" label="Blog" disabled />
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
