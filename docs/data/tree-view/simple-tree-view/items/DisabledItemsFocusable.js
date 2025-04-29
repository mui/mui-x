import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

export default function DisabledItemsFocusable() {
  const [disabledItemsFocusable, setDisabledItemsFocusable] = React.useState(false);
  const handleToggle = (event) => {
    setDisabledItemsFocusable(event.target.checked);
  };

  return (
    <Stack spacing={2}>
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
      <Box sx={{ minHeight: 352, minWidth: 250 }}>
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
            <TreeItem itemId="charts-community" label="@mui/x-charts" disabled />
          </TreeItem>
          <TreeItem itemId="tree-view" label="Tree View" disabled>
            <TreeItem itemId="tree-view-community" label="@mui/x-tree-view" />
          </TreeItem>
        </SimpleTreeView>
      </Box>
    </Stack>
  );
}
