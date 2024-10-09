import * as React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

const MUI_X_PRODUCTS = [
  {
    id: 'grid',
    label: 'Data Grid',
    children: [
      { id: 'grid-community', label: '@mui/x-data-grid' },
      { id: 'grid-pro', label: '@mui/x-data-grid-pro' },
      { id: 'grid-premium', label: '@mui/x-data-grid-premium' },
    ],
  },
  {
    id: 'pickers',
    label: 'Date and Time Pickers',
    children: [
      { id: 'pickers-community', label: '@mui/x-date-pickers' },
      { id: 'pickers-pro', label: '@mui/x-date-pickers-pro' },
    ],
  },
  {
    id: 'charts',
    label: 'Charts',
    children: [{ id: 'charts-community', label: '@mui/x-charts' }],
  },
  {
    id: 'tree-view',
    label: 'Tree View',
    children: [{ id: 'tree-view-community', label: '@mui/x-tree-view' }],
  },
];

export default function SelectionPropagation() {
  const [selectionPropagation, setSelectionPropagation] = React.useState({
    parents: true,
    descendants: true,
  });

  return (
    <div style={{ width: '100%' }}>
      <Stack direction="row" spacing={2}>
        <FormControlLabel
          control={
            <Checkbox
              checked={selectionPropagation.descendants}
              onChange={(event) =>
                setSelectionPropagation((prev) => ({
                  ...prev,
                  descendants: event.target.checked,
                }))
              }
            />
          }
          label="Auto select descendants"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={selectionPropagation.parents}
              onChange={(event) =>
                setSelectionPropagation((prev) => ({
                  ...prev,
                  parents: event.target.checked,
                }))
              }
            />
          }
          label="Auto select parents"
        />
      </Stack>
      <Box sx={{ minHeight: 352, minWidth: 250 }}>
        <RichTreeView
          items={MUI_X_PRODUCTS}
          checkboxSelection
          selectionPropagation={selectionPropagation}
          defaultExpandedItems={['grid', 'pickers', 'tree-view']}
        />
      </Box>
    </div>
  );
}
