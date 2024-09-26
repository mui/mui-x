import * as React from 'react';
import {
  DataGridPremium,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';

export default function RowGroupingPropagateSelection() {
  const data = useMovieData();
  const apiRef = useGridApiRef();
  const [rowSelectionPropagation, setRowSelectionPropagation] = React.useState({
    parents: true,
    descendants: true,
  });

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      rowGrouping: {
        model: ['company', 'director'],
      },
    },
  });

  return (
    <div style={{ width: '100%' }}>
      <Stack direction="row" spacing={2}>
        <FormControlLabel
          control={
            <Checkbox
              checked={rowSelectionPropagation.descendants}
              onChange={(event) =>
                setRowSelectionPropagation((prev) => ({
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
              checked={rowSelectionPropagation.parents}
              onChange={(event) =>
                setRowSelectionPropagation((prev) => ({
                  ...prev,
                  parents: event.target.checked,
                }))
              }
            />
          }
          label="Auto select parents"
        />
      </Stack>
      <div style={{ height: 400 }}>
        <DataGridPremium
          {...data}
          apiRef={apiRef}
          initialState={initialState}
          checkboxSelection
          rowSelectionPropagation={rowSelectionPropagation}
        />
      </div>
    </div>
  );
}
