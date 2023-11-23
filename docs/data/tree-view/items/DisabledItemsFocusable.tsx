import * as React from 'react';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FormControlLabel from '@mui/material/FormControlLabel';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { TreeView } from '@mui/x-tree-view/TreeView';

type MuiProduct = TreeViewBaseItem<{ disabled?: boolean }>;

const MUI_X_PRODUCTS: MuiProduct[] = [
  {
    nodeId: 'grid',
    label: 'Data Grid',
    children: [
      { nodeId: 'grid-community', label: '@mui/x-data-grid' },
      { nodeId: 'grid-pro', label: '@mui/x-data-grid-pro' },
      { nodeId: 'grid-premium', label: '@mui/x-data-grid-premium' },
    ],
  },
  {
    nodeId: 'pickers',
    label: 'Date and Time Pickers',
    children: [
      { nodeId: 'pickers-community', label: '@mui/x-date-pickers' },
      { nodeId: 'pickers-pro', label: '@mui/x-date-pickers-pro' },
    ],
  },
  {
    nodeId: 'charts',
    label: 'Charts',
    children: [{ nodeId: 'charts-community', label: '@mui/x-charts' }],
  },
  {
    nodeId: 'tree-view',
    label: 'Tree View',
    children: [
      { nodeId: 'tree-view-community', label: '@mui/x-tree-view' },
      { nodeId: 'tree-view-pro', label: '@mui/x-tree-view-pro', disabled: true },
    ],
  },
  {
    nodeId: 'scheduler',
    label: 'Scheduler',
    disabled: true,
    children: [{ nodeId: 'scheduler-community', label: '@mui/x-scheduler' }],
  },
];

const isItemDisabled = (item: MuiProduct) => !!item.disabled;

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
          label="Allow focusing on disabled items"
        />
      </Box>
      <Box sx={{ height: 312, flexGrow: 1, maxWidth: 400 }}>
        <TreeView
          items={MUI_X_PRODUCTS}
          isItemDisabled={isItemDisabled}
          disabledItemsFocusable={disabledItemsFocusable}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        />
      </Box>
    </Box>
  );
}
