import * as React from 'react';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

export default function DisabledItemsFocusable() {
  const [disabledItemsFocusable, setDisabledItemsFocusable] = React.useState(false);
  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDisabledItemsFocusable(event.target.checked);
  };

  return (
    <Box sx={{ flexGrow: 1, maxWidth: 400 }}>
      <Box sx={{ mb: 1 }}>
        <FormControlLabel
          control={
            <Switch
              checked={disabledItemsFocusable}
              onChange={handleToggle}
              name="disabledItemsFocusable"
            />
          }
          label="Allow focusing disabled items"
        />
      </Box>
      <Box sx={{ minHeight: 200, flexGrow: 1, maxWidth: 400 }}>
        <SimpleTreeView disabledItemsFocusable={disabledItemsFocusable}>
          <TreeItem itemId="grid" label="Data Grid">
            <TreeItem itemId="grid-community" label="@mui/x-data-grid" />
            <TreeItem itemId="grid-pro" label="@mui/x-data-grid-pro" />
            <TreeItem itemId="grid-premium" label="@mui/x-data-grid-premium" />
          </TreeItem>
          <TreeItem itemId="pickers" label="Date and Time Pickers">
            <TreeItem itemId="pickers-community" label="@mui/x-date-pickers" />
            <TreeItem itemId="pickers-pro" label="@mui/x-date-pickers-pro" />
          </TreeItem>
          <TreeItem itemId="charts" label="Charts">
            <TreeItem itemId="charts-community" label="@mui/x-charts" />
          </TreeItem>
          <TreeItem itemId="tree-view" label="Tree View">
            <TreeItem itemId="tree-view-community" label="@mui/x-tree-view" />
            <TreeItem itemId="tree-view-pro" label="@mui/x-tree-view-pro" disabled />
          </TreeItem>
          <TreeItem itemId="scheduler" label="Scheduler" disabled>
            <TreeItem itemId="scheduler-community" label="@mui/x-scheduler" />
          </TreeItem>
        </SimpleTreeView>
      </Box>
    </Box>
  );
}
