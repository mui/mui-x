---
title: Data Grid - Filtering customization recipes
---

# Data Grid - Filtering customization recipes

Advanced filtering customization recipes.

## Persisting filters in local storage

You can persist the filters in the local storage to keep the filters applied after the page is reloaded.

In the demo below, the [`React.useSyncExternalStore` hook](https://react.dev/reference/react/useSyncExternalStore) is used to synchronize the filters with the local storage.

```tsx
import * as React from 'react';
import { DataGrid, DataGridProps, GridFilterModel } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

const createFilterModelStore = () => {
  let listeners: Array<() => void> = [];
  const lsKey = 'gridFilterModel';
  const emptyModel = 'null';

  return {
    subscribe: (callback: () => void) => {
      listeners.push(callback);
      return () => {
        listeners = listeners.filter((listener) => listener !== callback);
      };
    },
    getSnapshot: () => {
      try {
        return localStorage.getItem(lsKey) || emptyModel;
      } catch (error) {
        return emptyModel;
      }
    },

    getServerSnapshot: () => {
      return emptyModel;
    },

    update: (filterModel: GridFilterModel) => {
      localStorage.setItem(lsKey, JSON.stringify(filterModel));
      listeners.forEach((listener) => listener());
    },
  };
};

const usePersistedFilterModel = () => {
  const [filterModelStore] = React.useState(createFilterModelStore);

  const filterModelString = React.useSyncExternalStore(
    filterModelStore.subscribe,
    filterModelStore.getSnapshot,
    filterModelStore.getServerSnapshot,
  );

  const filterModel = React.useMemo(() => {
    try {
      return (JSON.parse(filterModelString) as GridFilterModel) || undefined;
    } catch (error) {
      return undefined;
    }
  }, [filterModelString]);

  return React.useMemo(
    () => [filterModel, filterModelStore.update] as const,
    [filterModel, filterModelStore.update],
  );
};

export default function FilteringLocalStorage() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  const [filterModel, setFilterModel] = usePersistedFilterModel();

  const onFilterModelChange = React.useCallback<
    NonNullable<DataGridProps['onFilterModelChange']>
  >(
    (newFilterModel) => {
      setFilterModel(newFilterModel);
    },
    [setFilterModel],
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        showToolbar
        filterModel={filterModel}
        onFilterModelChange={onFilterModelChange}
      />
    </div>
  );
}

```

## Quick filter outside of the grid

The [Quick Filter](/x/react-data-grid/filtering/quick-filter/) component is typically used in the Data Grid's Toolbar component slot.

Some use cases may call for placing components like the Quick Filter outside of the Grid.
This requires certain considerations due to the Grid's context structure.
The following example shows how to accomplish this:

```tsx
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
                            material={{ sx: { marginRight: -0.75 } }}
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

```

## Calculating filtered rows in advance

The [Grid API](/x/react-data-grid/api-object/#how-to-use-the-api-object) provides the [`getFilterState`](/x/api/data-grid/grid-api/#grid-api-prop-getFilterState) method, which allows you to display the row count for predefined filters upfront without applying filters to the Data Grid:

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGridPro, useGridApiRef, GridFilterModel } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const predefinedFilters: { label: string; filterModel: GridFilterModel }[] = [
  {
    label: 'All',
    filterModel: { items: [] },
  },
  {
    label: 'Filled',
    filterModel: { items: [{ field: 'status', operator: 'is', value: 'Filled' }] },
  },
  {
    label: 'Open',
    filterModel: { items: [{ field: 'status', operator: 'is', value: 'Open' }] },
  },
  {
    label: 'Rejected',
    filterModel: { items: [{ field: 'status', operator: 'is', value: 'Rejected' }] },
  },
  {
    label: 'Partially Filled',
    filterModel: {
      items: [{ field: 'status', operator: 'is', value: 'PartiallyFilled' }],
    },
  },
];

export default function FilteredRowCount() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 1000,
    maxColumns: 10,
  });

  const apiRef = useGridApiRef();

  const [predefinedFiltersRowCount, setPredefinedFiltersRowCount] = React.useState<
    number[]
  >([]);

  const getFilteredRowsCount = React.useCallback(
    (filterModel: GridFilterModel) => {
      const rowIds = apiRef.current?.getAllRowIds();
      const filterState = apiRef.current?.getFilterState(filterModel);
      if (!rowIds || !filterState) {
        return 0;
      }

      const { filteredRowsLookup } = filterState;
      return rowIds.filter((rowId) => filteredRowsLookup[rowId] !== false).length;
    },
    [apiRef],
  );

  React.useEffect(() => {
    // Calculate the row count for predefined filters
    if (data.rows.length === 0) {
      return;
    }

    setPredefinedFiltersRowCount(
      predefinedFilters.map(({ filterModel }) => getFilteredRowsCount(filterModel)),
    );
  }, [apiRef, data.rows, getFilteredRowsCount]);

  return (
    <div style={{ overflow: 'hidden' }}>
      <Stack direction="row" gap={1} mb={1} flexWrap="wrap">
        {predefinedFilters.map(({ label, filterModel }, index) => {
          const count = predefinedFiltersRowCount[index];
          return (
            <Button
              key={label}
              onClick={() => apiRef.current?.setFilterModel(filterModel)}
              variant="outlined"
            >
              {label} {count !== undefined ? `(${count})` : ''}
            </Button>
          );
        })}
      </Stack>
      <Box sx={{ height: 520, width: '100%' }}>
        <DataGridPro {...data} loading={loading} apiRef={apiRef} />
      </Box>
    </div>
  );
}

```
