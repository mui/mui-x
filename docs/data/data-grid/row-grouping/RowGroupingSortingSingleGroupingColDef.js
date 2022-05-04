import * as React from 'react';
import {
  DataGridPremium,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';

export default function RowGroupingSortingSingleGroupingColDef() {
  const data = useMovieData();
  const [mainGroupingCriteria, setMainGroupingCriteria] =
    React.useState('undefined');

  const apiRef = useGridApiRef();

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      rowGrouping: {
        model: ['company', 'director'],
      },
    },
  });

  return (
    <Stack style={{ width: '100%' }} alignItems="flex-start" spacing={2}>
      <FormControl fullWidth>
        <InputLabel
          htmlFor="main-grouping-criteria"
          id="ain-grouping-criteria-label"
        >
          Main Grouping Criteria
        </InputLabel>
        <Select
          label="Main Grouping Criteria"
          onChange={(e) => setMainGroupingCriteria(e.target.value)}
          value={mainGroupingCriteria}
          id="main-grouping-criteria"
          labelId="main-grouping-criteria-label"
        >
          <MenuItem value="undefined">Default behavior</MenuItem>
          <MenuItem value="company">Company</MenuItem>
          <MenuItem value="director">Director</MenuItem>
        </Select>
      </FormControl>
      <div style={{ height: 400, width: '100%' }}>
        <DataGridPremium
          {...data}
          apiRef={apiRef}
          disableSelectionOnClick
          defaultGroupingExpansionDepth={-1}
          initialState={initialState}
          rowGroupingColumnMode="single"
          groupingColDef={{
            mainGroupingCriteria:
              mainGroupingCriteria === 'undefined'
                ? undefined
                : mainGroupingCriteria,
          }}
        />
      </div>
    </Stack>
  );
}
