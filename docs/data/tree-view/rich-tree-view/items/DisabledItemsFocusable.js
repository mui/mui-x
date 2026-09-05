import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { MUI_X_PRODUCTS } from '../../datasets/disabledProducts';

const isItemDisabled = (item) => !!item.disabled;

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
        <RichTreeView
          items={MUI_X_PRODUCTS}
          isItemDisabled={isItemDisabled}
          disabledItemsFocusable={disabledItemsFocusable}
        />
      </Box>
    </Stack>
  );
}
