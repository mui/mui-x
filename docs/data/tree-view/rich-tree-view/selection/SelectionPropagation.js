import * as React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

import { EMPLOYEES_DATASET } from '../../datasets/employees';

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
      <Box sx={{ height: 256, minWidth: 250, overflowY: 'auto' }}>
        <RichTreeView
          items={EMPLOYEES_DATASET}
          checkboxSelection
          multiSelect
          selectionPropagation={selectionPropagation}
          defaultExpandedItems={['8', '12']}
        />
      </Box>
    </div>
  );
}
