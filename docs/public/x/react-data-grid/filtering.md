# Data Grid - Filtering

Easily filter your rows based on one or several criteria.

The filters can be modified through the Data Grid interface in several ways:

- By opening the column menu and clicking the _Filter_ menu item.
- By clicking the _Filters_ button in the Data Grid toolbar (if enabled).

Each column type has its own filter operators.
The demo below lets you explore all the operators for each built-in column type.

_See [the dedicated section](/x/react-data-grid/filtering/customization/) to learn how to create your own custom filter operator._

```tsx
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

export default function BasicExampleDataGrid() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid {...data} loading={loading} showToolbar />
    </div>
  );
}

```

## Single and multi-filters

:::warning
The Data Grid can only filter the rows according to one criterion at the time.

To use [multi-filters](/x/react-data-grid/filtering/multi-filters/), you need to upgrade to the [Pro plan](/x/introduction/licensing/#pro-plan) or above.
:::

## Pass filters to the Data Grid

### Structure of the model

The full typing details can be found on the [GridFilterModel API page](/x/api/data-grid/grid-filter-model/).

The filter model is composed of a list of `items` and a `logicOperator`:

#### The `items`

A filter item represents a filtering rule and is composed of several elements:

- `filterItem.field`: the field on which the rule applies.
- `filterItem.value`: the value to look for.
- `filterItem.operator`: name of the operator method to use (for example _contains_), matches the `value` key of the operator object.
- `filterItem.id` ([<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')): required when multiple filter items are used.

:::info
Some operators do not need any value (for instance the `isEmpty` operator of the `string` column).
:::

#### The `logicOperator` [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

The `logicOperator` tells the Data Grid if a row should satisfy all (`AND`) filter items or at least one (`OR`) in order to be considered valid.

```ts
// Example 1: get rows with rating > 4 OR isAdmin = true
const filterModel: GridFilterModel = {
  items: [
    { id: 1, field: 'rating', operator: '>', value: '4' },
    { id: 2, field: 'isAdmin', operator: 'is', value: 'true' },
  ],
  logicOperator: GridLogicOperator.Or,
};

// Example 2: get rows with rating > 4 AND isAdmin = true
const filterModel: GridFilterModel = {
  items: [
    { id: 1, field: 'rating', operator: '>', value: '4' },
    { id: 2, field: 'isAdmin', operator: 'is', value: 'true' },
  ],
  logicOperator: GridLogicOperator.And,
};
```

If no `logicOperator` is provided, the Data Grid will use `GridLogicOperator.Or` by default.

### Initialize the filters

To initialize the filters without controlling them, provide the model to the `initialState` prop.

```jsx
<DataGrid
  initialState={{
    filter: {
      filterModel: {
        items: [{ field: 'rating', operator: '>', value: '2.5' }],
      },
    },
  }}
/>
```

```tsx
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

export default function InitialFilters() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        showToolbar
        initialState={{
          ...data.initialState,
          filter: {
            ...data.initialState?.filter,
            filterModel: {
              items: [
                {
                  field: 'rating',
                  operator: '>',
                  value: '2.5',
                },
              ],
            },
          },
        }}
      />
    </div>
  );
}

```

### Controlled filters

Use the `filterModel` prop to control the filter applied on the rows.

You can use the `onFilterModelChange` prop to listen to changes to the filters and update the prop accordingly.

```jsx
<DataGrid
  filterModel={{
    items: [{ field: 'rating', operator: '>', value: '2.5' }],
  }}
/>
```

```tsx
import * as React from 'react';
import { DataGrid, GridFilterModel } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

export default function ControlledFilters() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  const [filterModel, setFilterModel] = React.useState<GridFilterModel>({
    items: [
      {
        field: 'rating',
        operator: '>',
        value: '2.5',
      },
    ],
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        showToolbar
        filterModel={filterModel}
        onFilterModelChange={(newFilterModel) => setFilterModel(newFilterModel)}
      />
    </div>
  );
}

```

## Disable the filters

### For all columns

Filters are enabled by default, but you can easily disable this feature by setting the `disableColumnFilter` prop.

```jsx
<DataGrid disableColumnFilter />
```

```tsx
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

export default function DisableFilteringGridAllColumns() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid {...data} loading={loading} disableColumnFilter />
    </div>
  );
}

```

### For some columns

To disable the filter of a single column, set the `filterable` property in `GridColDef` to `false`.

In the example below, the _rating_ column cannot be filtered.

```js
<DataGrid columns={[...columns, { field: 'rating', filterable: false }]} />
```

```tsx
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

export default function DisableFilteringGridSomeColumns() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  const columns = React.useMemo(
    () =>
      data.columns.map((col) =>
        col.field === 'rating' ? { ...col, filterable: false } : col,
      ),
    [data.columns],
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid {...data} loading={loading} columns={columns} />
    </div>
  );
}

```

### Filter non-filterable columns programmatically

You can initialize the `filterModel`, set the `filterModel` prop, or use the API method `apiRef.current.setFilterModel` to set the filters for non-filterable columns. These filters will be applied but will be read-only on the UI and the user won't be able to change them.

```jsx
const columns = [
  { field: 'name', filterable: false },
  ...otherColumns,
]

<DataGrid
  filterModel={{
    items: [{ field: 'name', operator: 'contains', value: 'a' }],
  }}
  columns={columns}
/>
```

```tsx
import * as React from 'react';
import { DataGrid, GridFilterModel } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

export default function ReadOnlyFilters() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  const columns = React.useMemo(
    () =>
      data.columns.map((column) => ({
        ...column,
        filterable: column.field !== 'name',
      })),
    [data.columns],
  );

  const [filterModel, setFilterModel] = React.useState<GridFilterModel>({
    items: [
      {
        field: 'name',
        operator: 'contains',
        value: 'a',
      },
    ],
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        columns={columns}
        showToolbar
        filterModel={filterModel}
        onFilterModelChange={(newFilterModel) => setFilterModel(newFilterModel)}
      />
    </div>
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

:::info
The `ignoreDiacritics` prop affects all columns and filter types, including [standard filters](/x/react-data-grid/filtering/), [quick filters](/x/react-data-grid/filtering/quick-filter/), and [header filters](/x/react-data-grid/filtering/header-filters/).
:::

## apiRef

The Data Grid exposes a set of methods via the `apiRef` object that are used internally in the implementation of the filtering feature.
The reference below describes the relevant functions.
See [API object](/x/react-data-grid/api-object/) for more details.

:::warning
This API should only be used as a last resort when the Data Grid's built-in props aren't sufficient for your specific use case.
:::

```jsx
import * as React from 'react';
import ApiDocs from 'docsx/src/modules/components/ApiDocs';
import api from 'docsx/pages/x/api/data-grid/grid-filter-api.json';

export default function FilterApiNoSnap() {
  return <ApiDocs api={api} />;
}

```

## Selectors

{{"component": "modules/components/SelectorsDocs.js", "category": "Filtering"}}

More information about the selectors and how to use them on the [dedicated page](/x/react-data-grid/state/#access-the-state)

## API

- [GridFilterForm](/x/api/data-grid/grid-filter-form/)
- [GridFilterItem](/x/api/data-grid/grid-filter-item/)
- [GridFilterModel](/x/api/data-grid/grid-filter-model/)
- [GridFilterOperator](/x/api/data-grid/grid-filter-operator/)
- [GridFilterPanel](/x/api/data-grid/grid-filter-panel/)
- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
