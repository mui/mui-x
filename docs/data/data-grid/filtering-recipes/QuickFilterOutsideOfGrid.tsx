import * as React from 'react';
import Portal from '@mui/material/Portal';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import {
  DataGrid,
  GridPortalWrapper,
  QuickFilter,
  QuickFilterClear,
  QuickFilterControl,
  ToolbarButton,
  ColumnsPanelTrigger,
  FilterPanelTrigger,
  Toolbar,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
import FilterListIcon from '@mui/icons-material/FilterList';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';

function MyCustomToolbar() {
  return (
    <React.Fragment>
      <Portal container={() => document.getElementById('filter-panel')!}>
        <GridPortalWrapper>
          <QuickFilter expanded>
            <QuickFilterControl
              render={({ ref, ...other }) => (
                <TextField
                  {...other}
                  sx={{ width: 260 }}
                  inputRef={ref}
                  aria-label="Search"
                  placeholder="Search..."
                  size="small"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon fontSize="small" />
                        </InputAdornment>
                      ),
                      endAdornment: other.value ? (
                        <InputAdornment position="end">
                          <QuickFilterClear
                            edge="end"
                            size="small"
                            aria-label="Clear search"
                            sx={{ marginRight: -0.75 }}
                          >
                            <CancelIcon fontSize="small" />
                          </QuickFilterClear>
                        </InputAdornment>
                      ) : null,
                    },
                  }}
                />
              )}
            />
          </QuickFilter>
        </GridPortalWrapper>
      </Portal>

      <Toolbar>
        <Tooltip title="Columns">
          <ColumnsPanelTrigger render={<ToolbarButton />}>
            <ViewColumnIcon fontSize="small" />
          </ColumnsPanelTrigger>
        </Tooltip>

        <Tooltip title="Filters">
          <FilterPanelTrigger
            render={(triggerProps, state) => (
              <ToolbarButton {...triggerProps} color="default">
                <Badge
                  badgeContent={state.filterCount}
                  color="primary"
                  variant="dot"
                >
                  <FilterListIcon fontSize="small" />
                </Badge>
              </ToolbarButton>
            )}
          />
        </Tooltip>
      </Toolbar>
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
          slotProps={{
            toolbar: {
              showQuickFilter: false,
            },
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
