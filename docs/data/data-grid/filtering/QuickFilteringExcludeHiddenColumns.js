import * as React from 'react';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useMovieData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['title', 'company', 'director', 'year', 'cinematicUniverse'];

export default function QuickFilteringExcludeHiddenColumns() {
  const data = useMovieData();

  const columns = React.useMemo(
    () => data.columns.filter((column) => VISIBLE_FIELDS.includes(column.field)),
    [data.columns],
  );

  const [filterModel, setFilterModel] = React.useState({
    items: [],
    quickFilterExcludeHiddenColumns: true,
    quickFilterValues: ['War'],
  });

  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({
    company: false,
  });

  const handleFilterModelChange = React.useCallback(
    (newModel) => setFilterModel(newModel),
    [],
  );

  const handleColumnVisibilityChange = React.useCallback(
    (newModel) => setColumnVisibilityModel(newModel),
    [],
  );

  const toggleYearColumn = React.useCallback(
    (event) => setColumnVisibilityModel(() => ({ company: event.target.checked })),
    [],
  );

  const toggleExcludeHiddenColumns = React.useCallback(
    (event) =>
      setFilterModel((model) => ({
        ...model,
        quickFilterExcludeHiddenColumns: event.target.checked,
      })),
    [],
  );

  return (
    <Box sx={{ width: 1 }}>
      <FormControlLabel
        checked={columnVisibilityModel.year}
        onChange={toggleYearColumn}
        control={<Switch color="primary" />}
        label="Show company column"
      />
      <FormControlLabel
        checked={filterModel.quickFilterExcludeHiddenColumns}
        onChange={toggleExcludeHiddenColumns}
        control={<Switch color="primary" />}
        label="Exclude hidden columns"
      />
      <Box sx={{ height: 400 }}>
        <DataGrid
          {...data}
          columns={columns}
          initialState={{
            filter: {
              filterModel,
            },
          }}
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          filterModel={filterModel}
          onFilterModelChange={handleFilterModelChange}
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={handleColumnVisibilityChange}
        />
      </Box>
    </Box>
  );
}
