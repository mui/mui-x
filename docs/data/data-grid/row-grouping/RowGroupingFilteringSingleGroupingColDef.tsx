import * as React from 'react';
import {
  DataGridPremium,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';

export default function RowGroupingFilteringSingleGroupingColDef() {
  const data = useMovieData();
  const [mainGroupingCriteria, setMainGroupingCriteria] =
    React.useState<string>('undefined');

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
    <Box sx={{ width: '100%' }}>
      <FormControl fullWidth>
        <InputLabel
          htmlFor="main-grouping-criteria"
          id="main-grouping-criteria-label"
        >
          Main grouping criteria
        </InputLabel>
        <Select
          label="Main grouping criteria"
          onChange={(event) => setMainGroupingCriteria(event.target.value)}
          value={mainGroupingCriteria}
          id="main-grouping-criteria"
          labelId="main-grouping-criteria-label"
        >
          <MenuItem value="undefined">Default behavior</MenuItem>
          <MenuItem value="company">Company</MenuItem>
          <MenuItem value="director">Director</MenuItem>
        </Select>
      </FormControl>
      <Box sx={{ height: 400, pt: 1 }}>
        <DataGridPremium
          {...data}
          apiRef={apiRef}
          disableRowSelectionOnClick
          defaultGroupingExpansionDepth={-1}
          initialState={initialState}
          groupingColDef={{
            mainGroupingCriteria:
              mainGroupingCriteria === 'undefined'
                ? undefined
                : mainGroupingCriteria,
          }}
        />
      </Box>
    </Box>
  );
}
