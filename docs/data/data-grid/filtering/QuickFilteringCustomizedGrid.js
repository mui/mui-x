import * as React from 'react';
import Box from '@mui/material/Box';
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridQuickFilterLogic,
} from '@mui/x-data-grid';

import { useDemoData } from '@mui/x-data-grid-generator';

function QuickSearchToolbar() {
  return (
    <Box
      sx={{
        p: 0.5,
        pb: 0,
      }}
    >
      <GridToolbarQuickFilter
        quickFilterParser={(searchInput) =>
          searchInput.split(',').map((value) => value.trim())
        }
      />
    </Box>
  );
}

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

export default function QuickFilteringCustomizedGrid() {
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
          if (column.field !== 'country') {
            return column;
          }
          return {
            ...column,
            getApplyQuickFilterFn: (value) => {
              if (!value) {
                return null;
              }
              return (params) => {
                return (
                  params.value.label &&
                  params.value.label.slice(0, value.length).toLowerCase() ===
                    value.toLowerCase()
                );
              };
            },
          };
        }),
    [data.columns],
  );

  return (
    <Box sx={{ height: 400, width: 1 }}>
      <DataGrid
        {...data}
        columns={columns}
        initialState={{
          filter: {
            filterModel: {
              items: [],
              quickFilterLogic: GridQuickFilterLogic.Or,
            },
          },
        }}
        components={{ Toolbar: QuickSearchToolbar }}
      />
    </Box>
  );
}
