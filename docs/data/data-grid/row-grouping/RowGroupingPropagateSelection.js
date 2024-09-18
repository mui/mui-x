import * as React from 'react';
import {
  DataGridPremium,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

export default function RowGroupingPropagateSelection() {
  const data = useMovieData();
  const apiRef = useGridApiRef();
  const [value, setValue] = React.useState('both');

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      rowGrouping: {
        model: ['company', 'director'],
      },
    },
  });

  const handleValueChange = React.useCallback((event) => {
    setValue(event.target.value);
  }, []);

  return (
    <div style={{ width: '100%' }}>
      <FormControl variant="standard" sx={{ pb: 1, px: 1 }} fullWidth>
        <InputLabel>Propagation behavior</InputLabel>
        <Select value={value} onChange={handleValueChange}>
          <MenuItem value="both">`both` - Both Parents and Children</MenuItem>
          <MenuItem value="parents">`parents` - Parents only</MenuItem>
          <MenuItem value="children">`children` - Children only</MenuItem>
          <MenuItem value="none">`none` - No selection propagation</MenuItem>
        </Select>
      </FormControl>
      <div style={{ height: 400 }}>
        <DataGridPremium
          {...data}
          apiRef={apiRef}
          initialState={initialState}
          checkboxSelection
          rowSelectionPropagation={value}
        />
      </div>
    </div>
  );
}
