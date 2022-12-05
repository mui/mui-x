import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

function QuickSearchToolbar() {
  return (
    <Box
      sx={{
        p: 0.5,
        pb: 0,
      }}
    >
      <GridToolbarQuickFilter />
    </Box>
  );
}

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

const getApplyFilterFnSameYear = (value) => {
  if (!value || value.length !== 4 || !/\d{4}/.test(value)) {
    // If the value is not a 4 digit string, it can not be a year so applying this filter is useless
    return null;
  }
  return (params) => {
    return params.value.getFullYear() === Number(value);
  };
};

export default function QuickFilteringCustomLogic() {
  const { data } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  // Otherwise filter will be applied on fields such as the hidden column id
  const columns = React.useMemo(
    () =>
      data.columns
        .filter((column) => VISIBLE_FIELDS.includes(column.field))
        .map((column) => {
          if (column.field === 'dateCreated') {
            return {
              ...column,
              getApplyQuickFilterFn: getApplyFilterFnSameYear,
            };
          }
          if (column.field === 'name') {
            return {
              ...column,
              getApplyQuickFilterFn: undefined,
            };
          }
          return column;
        }),
    [data.columns],
  );

  return (
    <Box sx={{ height: 400, width: 1 }}>
      <DataGrid
        {...data}
        columns={columns}
        components={{ Toolbar: QuickSearchToolbar }}
      />
    </Box>
  );
}
