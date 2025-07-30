# Data Grid - Quick filter

One filter field to quickly filter grid.

Quick filter allows filtering rows by multiple columns with a single text input.

By default, the quick filter considers the input as a list of values separated by space and keeps only rows that contain all the values.

The quick filter is displayed by default when `showToolbar` is passed to the `<DataGrid/>` component. See the [Quick Filter component](/x/react-data-grid/components/quick-filter/) for examples on how to add the quick filter to a custom toolbar.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useMovieData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['title', 'company', 'director', 'year', 'cinematicUniverse'];

export default function QuickFilteringGrid() {
  const data = useMovieData();

  // Otherwise filter will be applied on fields such as the hidden column id
  const columns = React.useMemo(
    () => data.columns.filter((column) => VISIBLE_FIELDS.includes(column.field)),
    [data.columns],
  );

  return (
    <Box sx={{ height: 400, width: 1 }}>
      <DataGrid
        {...data}
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        columns={columns}
        showToolbar
      />
    </Box>
  );
}

```

## Initialize the quick filter values

The quick filter values can be initialized by setting the `filter.filterModel.quickFilterValues` property of the `initialState` prop.

```tsx
<DataGrid
  initialState={{
    filter: {
      filterModel: {
        items: [],
        quickFilterValues: ['Disney', 'Star'],
      },
    },
  }}
/>
```

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useMovieData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['title', 'company', 'director', 'year', 'cinematicUniverse'];

export default function QuickFilteringInitialize() {
  const data = useMovieData();

  // Otherwise filter will be applied on fields such as the hidden column id
  const columns = React.useMemo(
    () => data.columns.filter((column) => VISIBLE_FIELDS.includes(column.field)),
    [data.columns],
  );

  return (
    <Box sx={{ height: 400, width: 1 }}>
      <DataGrid
        {...data}
        initialState={{
          filter: {
            filterModel: {
              items: [],
              quickFilterValues: ['Disney', 'Star'],
            },
          },
        }}
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        columns={columns}
        showToolbar
      />
    </Box>
  );
}

```

## Including hidden columns

By default, the quick filter excludes hidden columns.

To include hidden columns in the quick filter, set `filterModel.quickFilterExcludeHiddenColumns` to `false`:

```tsx
<DataGrid
  initialState={{
    filter: {
      filterModel: {
        items: [],
        quickFilterExcludeHiddenColumns: false,
      },
    },
  }}
/>
```

In the demo below, the `company` column is hidden. You'll only see 5 results because rows where the `company` value is `'Warner Bros.'` are excluded.
However, when you disable the `Exclude hidden columns` switch, the rows containing `'Warner'` in the `company` field will be displayed again, even though the column remains hidden.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import {
  DataGrid,
  GridColumnVisibilityModel,
  GridFilterModel,
} from '@mui/x-data-grid';
import { useMovieData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['title', 'company', 'director', 'year', 'cinematicUniverse'];

export default function QuickFilteringExcludeHiddenColumns() {
  const data = useMovieData();

  const columns = React.useMemo(
    () => data.columns.filter((column) => VISIBLE_FIELDS.includes(column.field)),
    [data.columns],
  );

  const [filterModel, setFilterModel] = React.useState<GridFilterModel>({
    items: [],
    quickFilterExcludeHiddenColumns: true,
    quickFilterValues: ['War'],
  });

  const [columnVisibilityModel, setColumnVisibilityModel] =
    React.useState<GridColumnVisibilityModel>({ company: false });

  const handleFilterModelChange = React.useCallback(
    (newModel: GridFilterModel) => setFilterModel(newModel),
    [],
  );

  const handleColumnVisibilityChange = React.useCallback(
    (newModel: GridColumnVisibilityModel) => setColumnVisibilityModel(newModel),
    [],
  );

  const toggleYearColumn = React.useCallback(
    (event: React.SyntheticEvent) =>
      setColumnVisibilityModel(() => ({ company: (event.target as any).checked })),
    [],
  );

  const toggleExcludeHiddenColumns = React.useCallback(
    (event: React.SyntheticEvent) =>
      setFilterModel((model) => ({
        ...model,
        quickFilterExcludeHiddenColumns: (event.target as any).checked,
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
          showToolbar
          filterModel={filterModel}
          onFilterModelChange={handleFilterModelChange}
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={handleColumnVisibilityChange}
        />
      </Box>
    </Box>
  );
}

```

## Custom filtering logic

The logic used for quick filter can be switched to filter rows that contain _at least_ one of the values specified instead of testing if it contains all of them.
To do so, set `quickFilterLogicOperator` to `GridLogicOperator.Or` as follow:

```js
initialState={{
  filter: {
    filterModel: {
      items: [],
      quickFilterLogicOperator: GridLogicOperator.Or,
    },
  },
}}
```

With the default settings, quick filter will only consider columns with types `'string'`,`'number'`, and `'singleSelect'`.

- For `'string'` and `'singleSelect'` columns, the cell's formatted value must **contain** the value
- For `'number'` columns, the cell's formatted value must **equal** the value

To modify or add the quick filter operators, add the property `getApplyQuickFilterFn` to the column definition.
This function is quite similar to `getApplyFilterFn`.
This function takes as an input a value of the quick filter and returns another function that takes the cell value as an input and returns `true` if it satisfies the operator condition.

In the example below, a custom filter is created for the `date` column to check if it contains the correct year.

```ts
const getApplyQuickFilterFn: GetApplyQuickFilterFn<any, unknown> = (value) => {
  if (!value || value.length !== 4 || !/\d{4}/.test(value)) {
    // If the value is not a 4 digit string, it cannot be a year so applying this filter is useless
    return null;
  }
  return (cellValue) => {
    if (cellValue instanceof Date) {
      return cellValue.getFullYear() === Number(value);
    }
    return false;
  };
};
```

To remove the quick filtering on a given column set `getApplyQuickFilterFn: () => null`.

In the demo below, the column "Name" is not searchable with the quick filter, and 4 digits figures will be compared to the year of column "Created on."

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GetApplyQuickFilterFn } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

const getApplyQuickFilterFnSameYear: GetApplyQuickFilterFn<any, unknown> = (
  value,
) => {
  if (!value || value.length !== 4 || !/\d{4}/.test(value)) {
    // If the value is not a 4-digit string, it cannot be a year so applying this filter is useless
    return null;
  }
  return (cellValue) => {
    if (cellValue instanceof Date) {
      return cellValue.getFullYear() === Number(value);
    }
    return false;
  };
};

export default function QuickFilteringCustomLogic() {
  const { data, loading } = useDemoData({
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
              getApplyQuickFilterFn: getApplyQuickFilterFnSameYear,
            };
          }
          if (column.field === 'name') {
            return {
              ...column,
              getApplyQuickFilterFn: () => null,
            };
          }
          return column;
        }),
    [data.columns],
  );

  return (
    <Box sx={{ height: 400, width: 1 }}>
      <DataGrid {...data} loading={loading} columns={columns} showToolbar />
    </Box>
  );
}

```

## Parsing values

The values used by the quick filter are obtained by splitting the input string with space.
If you want to implement a more advanced logic, the quick filter accepts a custom parser.
This function takes the quick filter input string and returns an array of values.

If you control the `quickFilterValues` either by controlling `filterModel` or with the initial state, the content of the input must be updated to reflect the new values.
By default, values are joint with spaces. You can customize this behavior by providing a custom formatter.
This formatter can be seen as the inverse of the `parser`.

For example, the following parser allows to search words containing a space by using the `','` to split values.

```jsx
// Default toolbar:
<DataGrid
  showToolbar
  slotProps={{
    toolbar: {
      quickFilterProps: {
        quickFilterParser: (searchInput) => searchInput.split(',').map((value) => value.trim()),
        quickFilterFormatter: (quickFilterValues) => quickFilterValues.join(', '),
        debounceMs: 200, // time before applying the new quick filter value
      },
    },
  }}
/>

// Custom quick filter:
<QuickFilter
  parser={(searchInput) => searchInput.split(',').map((value) => value.trim())}
  formatter={(quickFilterValues) => quickFilterValues.join(', ')}
  debounceMs={200} // time before applying the new quick filter value
>
  {/* ... */}
</QuickFilter>
```

In the following demo, the quick filter value `"Saint Martin, Saint Lucia"` will return rows with country is Saint Martin or Saint Lucia.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridLogicOperator } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

export default function QuickFilteringCustomizedGrid() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  // Otherwise filter will be applied on fields such as the hidden column id
  const columns = React.useMemo(
    () => data.columns.filter((column) => VISIBLE_FIELDS.includes(column.field)),
    [data.columns],
  );

  return (
    <Box sx={{ height: 400, width: 1 }}>
      <DataGrid
        {...data}
        loading={loading}
        columns={columns}
        initialState={{
          ...data.initialState,
          filter: {
            ...data.initialState?.filter,
            filterModel: {
              items: [],
              quickFilterLogicOperator: GridLogicOperator.Or,
            },
          },
        }}
        slotProps={{
          toolbar: {
            quickFilterProps: {
              quickFilterParser: (searchInput: string) =>
                searchInput
                  .split(',')
                  .map((value) => value.trim())
                  .filter((value) => value !== ''),
            },
          },
        }}
        showToolbar
      />
    </Box>
  );
}

```

## Ignore diacritics (accents)

When filtering, diacritics—accented letters such as _é_ or _à_—are considered distinct from their standard counterparts (_e_ and _a_).
This can lead to a poor experience when users expect them to be treated as equivalent.

If your dataset includes diacritics that need to be ignored, you can pass the `ignoreDiacritics` prop to the Data Grid:

```tsx
<DataGrid ignoreDiacritics />
```

In the demo below, you can use the **Ignore diacritics** toggle to see how the filtering behavior changes:

```tsx
import * as React from 'react';
import { DataGrid, GridColDef, GridFilterModel } from '@mui/x-data-grid';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const rows = [
  { id: 0, string: 'Café', date: new Date(2023, 1, 1), singleSelect: 'Jalapeño' },
];
const columns: GridColDef[] = [
  { field: 'string', width: 100 },
  {
    field: 'date',
    type: 'date',
    width: 150,
    valueFormatter: (value) => dateFormatter.format(value),
  },
  {
    field: 'singleSelect',
    type: 'singleSelect',
    valueOptions: ['Jalapeño'],
  },
];

export default function QuickFilteringDiacritics() {
  const [filterModel, setFilterModel] = React.useState<GridFilterModel>({
    items: [],
    quickFilterValues: ['cafe'],
  });
  const [ignoreDiacritics, setIgnoreDiacritics] = React.useState(true);

  return (
    <div style={{ width: '100%' }}>
      <FormControlLabel
        checked={ignoreDiacritics}
        onChange={(event) =>
          setIgnoreDiacritics((event.target as HTMLInputElement).checked)
        }
        control={<Switch />}
        label="Ignore diacritics"
      />
      <div style={{ height: 200, width: '100%' }}>
        <DataGrid
          key={ignoreDiacritics.toString()}
          rows={rows}
          columns={columns}
          filterModel={filterModel}
          onFilterModelChange={setFilterModel}
          disableColumnSelector
          disableDensitySelector
          hideFooter
          showToolbar
          ignoreDiacritics={ignoreDiacritics}
        />
      </div>
    </div>
  );
}

```

:::info
The `ignoreDiacritics` prop affects all columns and filter types, including [standard filters](/x/react-data-grid/filtering/), [quick filters](/x/react-data-grid/filtering/quick-filter/), and [header filters](/x/react-data-grid/filtering/header-filters/).
:::

## Disable quick filter

The quick filter can be removed from the toolbar by setting `slotProps.toolbar.showQuickFilter` to `false`:

```tsx
<DataGrid slotProps={{ toolbar: { showQuickFilter: false } }} />
```

## API

- [GridToolbarQuickFilter](/x/api/data-grid/grid-toolbar-quick-filter/)
- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
