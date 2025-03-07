import * as React from 'react';
import Portal from '@mui/material/Portal';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import {
  DataGrid,
  GridPortalWrapper,
  GridToolbarQuickFilter,
  GridToolbar,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

function MyCustomToolbar(props: any) {
  return (
    <React.Fragment>
      <Portal container={() => document.getElementById('filter-panel')!}>
        <GridPortalWrapper>
          <GridToolbarQuickFilter />
        </GridPortalWrapper>
      </Portal>
      <GridToolbar {...props} />
    </React.Fragment>
  );
}

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

export default function QuickFilterOutsideOfGrid() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    rowLength: 1000,
  });

  // Otherwise filter will be applied on fields such as the hidden column id
  const columns = React.useMemo(
    () => data.columns.filter((column) => VISIBLE_FIELDS.includes(column.field)),
    [data.columns],
  );

  return (
    <Grid container spacing={2}>
      <Grid>
        <Box id="filter-panel" />
      </Grid>
      <Grid style={{ height: 400, width: '100%' }}>
        <DataGrid
          {...data}
          loading={loading}
          columns={columns}
          slots={{
            toolbar: MyCustomToolbar,
          }}
          showToolbar
          initialState={{
            filter: {
              filterModel: {
                items: [],
                quickFilterExcludeHiddenColumns: true,
              },
            },
          }}
        />
      </Grid>
    </Grid>
  );
}
