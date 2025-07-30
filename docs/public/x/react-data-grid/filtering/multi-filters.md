---
title: Data Grid - Multi-filters
---

# Data Grid - Multi-filters [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

Let end users apply multiple filters to the Data Grid simultaneously.

By default, it's only possible to apply one filter at a time to the Data Grid.
With the Data Grid Pro, users can apply multiple filters based on different criteria for more fine-grained data analysis.
They can apply multiple filters to a single column and multiple columns simultaneously.

The demo below shows how this feature works.
Click the filter icon to open the menu and add the first filter—the Data Grid dynamically responds as you enter a value.
Then click **Add Filter** to apply additional criteria.

```tsx
import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

export default function BasicExampleDataGridPro() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro {...data} loading={loading} showToolbar />
    </div>
  );
}

```

## Implementing multi-filters

The multi-filter feature is available by default with the Data Grid Pro and doesn't require any additional configuration.

### One filter per column

To limit the user to only applying one filter to any given column, you can use the [`filterColumns`](/x/api/data-grid/grid-filter-form/) and [`getColumnForNewFilter`](/x/api/data-grid/grid-filter-panel/) props available to `slotProps.filterPanel` as shown in the demo below:

```tsx
import * as React from 'react';
import {
  DataGridPro,
  FilterColumnsArgs,
  GetColumnForNewFilterArgs,
} from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

export default function DisableMultiFiltersDataGridPro() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  const filterColumns = ({ field, columns, currentFilters }: FilterColumnsArgs) => {
    // remove already filtered fields from list of columns
    const filteredFields = currentFilters?.map((item) => item.field);
    return columns
      .filter(
        (colDef) =>
          colDef.filterable &&
          (colDef.field === field || !filteredFields.includes(colDef.field)),
      )
      .map((column) => column.field);
  };

  const getColumnForNewFilter = ({
    currentFilters,
    columns,
  }: GetColumnForNewFilterArgs) => {
    const filteredFields = currentFilters?.map(({ field }) => field);
    const columnForNewFilter = columns
      .filter(
        (colDef) => colDef.filterable && !filteredFields.includes(colDef.field),
      )
      .find((colDef) => colDef.filterOperators?.length);
    return columnForNewFilter?.field ?? null;
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        loading={loading}
        showToolbar
        slotProps={{
          filterPanel: {
            filterFormProps: {
              filterColumns,
            },
            getColumnForNewFilter,
          },
        }}
      />
    </div>
  );
}

```

## Disabling multi-filters

To disable multi-filtering, pass the `disableMultipleColumnsFiltering` to the Data Grid Pro.

```tsx
<DataGridPro disableMultipleColumnsFiltering />
```

### Remove multi-filter action buttons

To disable the **Add Filter** or **Remove All** buttons, pass `disableAddFilterButton` or `disableRemoveAllButton`, respectively, to `componentsProps.filterPanel` as shown below:

```tsx
import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

export default function DisableActionButtonsDataGridPro() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        loading={loading}
        showToolbar
        slotProps={{
          filterPanel: {
            disableAddFilterButton: true,
            disableRemoveAllButton: true,
          },
        }}
      />
    </div>
  );
}

```

## API

- [GridFilterPanel](/x/api/data-grid/grid-filter-panel/)
- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
