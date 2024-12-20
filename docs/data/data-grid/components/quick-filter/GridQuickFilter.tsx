import * as React from 'react';
import { DataGrid, Grid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';

function Toolbar() {
  return (
    <Grid.Toolbar.Root>
      <Grid.QuickFilter.Root>
        <Grid.QuickFilter.Control
          render={({ ref, ...other }) => (
            <TextField
              {...other}
              sx={{ width: 260 }}
              inputRef={ref}
              aria-label="Search"
              placeholder="Search..."
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: other.value ? (
                  <InputAdornment position="end">
                    <Grid.QuickFilter.Clear
                      edge="end"
                      size="small"
                      aria-label="Clear search"
                    >
                      <ClearIcon fontSize="small" />
                    </Grid.QuickFilter.Clear>
                  </InputAdornment>
                ) : null,
              }}
            />
          )}
        />
      </Grid.QuickFilter.Root>
    </Grid.Toolbar.Root>
  );
}

export default function GridQuickFilter() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 10,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid {...data} loading={loading} slots={{ toolbar: Toolbar }} />
    </div>
  );
}
