---
title: Data Grid - Header filters
---

# Data Grid - Header filters [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

Give users quick-access column filters in the Data Grid header.

By default, users access the Data Grid's filtering features through the filter panel in the toolbar.
The header filter feature adds a row to the top of the Data Grid Pro that lets users quickly filter columns directly in place.
Filters added through the filter panel are synchronized with header filters, and vice versa.

In the demo below, you can switch between different operators by clicking the operator button in the header filter cell or pressing <kbd><kbd class="key">⌘ Command</kbd>+<kbd class="key">Enter</kbd></kbd> (or <kbd><kbd class="key">Ctrl</kbd>+<kbd class="key">Enter</kbd></kbd> on Windows) when focusing on a header filter cell.

```tsx
import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function HeaderFilteringDataGridPro() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    rowLength: 100,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        loading={loading}
        initialState={{
          ...data.initialState,
          columns: {
            columnVisibilityModel: {
              avatar: false,
              id: false,
            },
          },
        }}
        headerFilters
      />
    </div>
  );
}

```

## Implementing header filters

To enable header filters, pass the `headerFilters` prop to the Data Grid Pro:

```tsx
<DataGridPro headerFilters>
```

### Disabling the default filter panel

You can disable the default filter panel using the `disableColumnFilter` prop, and show only the default operator by passing `slots.headerFilterMenu` as `null`.

```tsx
import * as React from 'react';
import { DataGridPro, gridClasses } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function SimpleHeaderFilteringDataGridPro() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    rowLength: 100,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        loading={loading}
        initialState={{
          ...data.initialState,
          columns: {
            columnVisibilityModel: {
              avatar: false,
              id: false,
            },
          },
        }}
        disableColumnFilter
        headerFilters
        slots={{
          headerFilterMenu: null,
        }}
        sx={{ [`.${gridClasses['columnHeader--filter']}`]: { px: 1 } }}
      />
    </div>
  );
}

```

### Inline clear button

By default, the **Clear filter** button is located in the header filter menu.
To display the button in the header filter cell instead, set `slotProps.headerFilterCell.showClearIcon` to `true`:

```tsx
import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'website'];

export default function HeaderFilteringInlineClearDataGridPro() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    rowLength: 100,
    visibleFields: VISIBLE_FIELDS,
  });

  const columns = React.useMemo(() => {
    return data.columns.map((col) => ({
      ...col,
      minWidth: 200,
    }));
  }, [data.columns]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        columns={columns}
        loading={loading}
        initialState={{
          ...data.initialState,
          filter: {
            filterModel: {
              items: [
                { id: 'name', field: 'name', operator: 'contains', value: 'a' },
                {
                  id: 'website',
                  field: 'website',
                  operator: 'contains',
                  value: 'http://',
                },
                { id: 'rating', field: 'rating', operator: '>', value: 2 },
              ],
            },
          },
        }}
        headerFilters
        slotProps={{
          headerFilterCell: {
            showClearIcon: true,
          },
        }}
      />
    </div>
  );
}

```

## Customizing header filters

You can override header filter cells individually or across the entire row.

### One header filter cell in a specific column

Use the `renderHeaderFilter()` method of the `GridColDef` to customize the header filter cell for a specific column.

```tsx
const columns: GridColDef[] = [
  {
    field: 'isAdmin',
    renderHeaderFilter: (params: GridHeaderFilterCellProps) => (
      <MyCustomHeaderFilter {...params} />
    ),
  },
];
```

The demo below uses the `renderHeaderFilter()` method to hide the header filter cell for the **Phone** column and customize it for the **Is admin?** column:

```tsx
import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import {
  DataGridPro,
  GridRenderHeaderFilterProps,
  gridFilterModelSelector,
  useGridSelector,
  useGridApiContext,
} from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

const getDefaultFilter = (field: string) => ({ field, operator: 'is' });

function AdminFilter(props: GridRenderHeaderFilterProps) {
  const { colDef } = props;
  const apiRef = useGridApiContext();
  const filterModel = useGridSelector(apiRef, gridFilterModelSelector);
  const currentFieldFilters = React.useMemo(
    () => filterModel.items?.filter(({ field }) => field === colDef.field),
    [colDef.field, filterModel.items],
  );

  const handleChange = React.useCallback(
    (event: SelectChangeEvent) => {
      if (!event.target.value) {
        if (currentFieldFilters[0]) {
          apiRef.current.deleteFilterItem(currentFieldFilters[0]);
        }
        return;
      }
      apiRef.current.upsertFilterItem({
        ...(currentFieldFilters[0] || getDefaultFilter(colDef.field)),
        value: event.target.value,
      });
    },
    [apiRef, colDef.field, currentFieldFilters],
  );

  const value = currentFieldFilters[0]?.value ?? '';
  const label = !value ? 'Filter' : 'Is admin';

  return (
    <FormControl variant="outlined" size="small" fullWidth>
      <InputLabel id="select-is-admin-label" shrink>
        {label}
      </InputLabel>
      <Select
        labelId="select-is-admin-label"
        id="select-is-admin"
        value={value}
        onChange={handleChange}
        label={label}
        inputProps={{ sx: { fontSize: 14 } }}
        notched
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value="true">True</MenuItem>
        <MenuItem value="false">False</MenuItem>
      </Select>
    </FormControl>
  );
}

export default function CustomHeaderFilterSingleDataGridPro() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    rowLength: 100,
    visibleFields: ['name', 'website', 'phone', 'isAdmin', 'salary'],
  });

  const columns = React.useMemo(
    () =>
      data.columns.map((colDef) => {
        if (colDef.field === 'isAdmin') {
          return {
            ...colDef,
            width: 200,
            renderHeaderFilter: (params: GridRenderHeaderFilterProps) => (
              <AdminFilter {...params} />
            ),
          };
        }
        if (colDef.field === 'phone') {
          // no header filter for `phone` field
          return { ...colDef, renderHeaderFilter: () => null };
        }
        return colDef;
      }),
    [data.columns],
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        loading={loading}
        columns={columns}
        disableColumnFilter
        headerFilters
      />
    </div>
  );
}

```

### All header filter cells in every column

Use `slots.headerFilterCell` to override all header filter cells in the row with a custom component:

```tsx
<DataGridPro {...data} slots={{ headerFilterCell: MyCustomHeaderFilterCell }} />
```

The default slot component handles keyboard navigation and focus management, so your custom component should also account for these accessibility features.
The demo below shows how to do this.

```tsx
import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import {
  DataGridPro,
  useGridSelector,
  gridFilterModelSelector,
  useGridApiContext,
  GridHeaderFilterCellProps,
  GridHeaderFilterEventLookup,
} from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

function CustomHeaderFilter(props: GridHeaderFilterCellProps) {
  const { colDef, width, height, hasFocus, colIndex, tabIndex } = props;
  const apiRef = useGridApiContext();
  const cellRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    if (hasFocus && cellRef.current) {
      const focusableElement =
        cellRef.current!.querySelector<HTMLElement>('[tabindex="0"]');
      const elementToFocus = focusableElement || cellRef.current;
      elementToFocus?.focus();
    }
  }, [apiRef, hasFocus]);

  const publish = React.useCallback(
    (
      eventName: keyof GridHeaderFilterEventLookup,
      propHandler?: React.EventHandler<any>,
    ) =>
      (event: React.SyntheticEvent) => {
        apiRef.current.publishEvent(
          eventName,
          apiRef.current.getColumnHeaderParams(colDef.field),
          event as any,
        );

        if (propHandler) {
          propHandler(event);
        }
      },
    [apiRef, colDef.field],
  );

  const onMouseDown = React.useCallback(
    (event: React.MouseEvent) => {
      if (!hasFocus) {
        cellRef.current?.focus();
        apiRef.current.setColumnHeaderFilterFocus(colDef.field, event);
      }
    },
    [apiRef, colDef.field, hasFocus],
  );

  const mouseEventsHandlers = React.useMemo(
    () => ({
      onKeyDown: publish('headerFilterKeyDown'),
      onClick: publish('headerFilterClick'),
      onMouseDown: publish('headerFilterMouseDown', onMouseDown),
    }),
    [publish, onMouseDown],
  );

  const filterModel = useGridSelector(apiRef, gridFilterModelSelector);
  const activeFiltersCount =
    filterModel.items?.filter(({ field }) => field === colDef.field).length ?? 0;

  return (
    <Stack
      sx={[
        {
          borderBottom: `1px solid var(--DataGrid-rowBorderColor)`,
        },
        hasFocus
          ? {
              outline: 'solid #1976d2 1px',
              outlineOffset: -2,
            }
          : {
              outline: '',
              outlineOffset: 0,
            },
      ]}
      tabIndex={tabIndex}
      ref={cellRef}
      data-field={colDef.field}
      width={width}
      height={height}
      justifyContent="center"
      alignItems="center"
      role="columnheader"
      aria-colindex={colIndex + 1}
      aria-label={colDef.headerName ?? colDef.field}
      {...mouseEventsHandlers}
    >
      <Button
        centerRipple={false}
        onClick={() => apiRef.current.showFilterPanel(colDef.field)}
      >
        {activeFiltersCount > 0 ? `${activeFiltersCount} active` : 'Add'} filters
      </Button>
    </Stack>
  );
}

export default function CustomHeaderFilterDataGridPro() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    rowLength: 100,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        loading={loading}
        initialState={{
          ...data.initialState,
          columns: {
            columnVisibilityModel: {
              avatar: false,
              id: false,
            },
          },
        }}
        slots={{
          headerFilterCell: CustomHeaderFilter,
        }}
        headerFilters
      />
    </div>
  );
}

```

:::success
Similarly, you can use `slots.headerFilterMenu` if you need to customize the header filter menu.
:::

### Header filter cells with custom filter operators

If you're using a [custom input component](/x/react-data-grid/filtering/customization/#custom-input-component) for the filter operator, you can use that same component in the header filter cell for a better user experience.
The custom input component receives the `headerFilterMenu` and `clearButton` props that you can use to render the filter operator menu and **Clear filter** button, respectively.

In the demo below, the **Rating** column uses a custom input, and you can filter by clicking on a star rating in the header filter cell:

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Rating, { RatingProps } from '@mui/material/Rating';
import {
  DataGridPro,
  getGridNumericOperators,
  GridFilterInputValueProps,
} from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

function RatingInputValue(
  props: GridFilterInputValueProps & {
    headerFilterMenu: React.ReactNode;
    clearButton: React.ReactNode;
  },
) {
  const { item, applyValue, focusElementRef, headerFilterMenu, clearButton } = props;

  const ratingRef: React.Ref<any> = React.useRef(null);
  React.useImperativeHandle(focusElementRef, () => ({
    focus: () => {
      ratingRef.current
        .querySelector(`input[value="${Number(item.value) || ''}"]`)
        .focus();
    },
  }));

  const handleFilterChange: RatingProps['onChange'] = (event, newValue) => {
    applyValue({ ...item, value: newValue });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <Rating
        name="custom-rating-filter-operator"
        value={Number(item.value)}
        onChange={handleFilterChange}
        precision={0.5}
        ref={ratingRef}
        sx={{ mr: 0.5 }}
      />
      {headerFilterMenu}
      {clearButton}
    </Box>
  );
}

export default function CustomHeaderFilterOperatorDataGridPro() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    rowLength: 100,
    visibleFields: VISIBLE_FIELDS,
  });

  const columns = React.useMemo(
    () =>
      data.columns.map((colDef) => {
        if (colDef.field === 'rating') {
          return {
            ...colDef,
            minWidth: 200,
            filterOperators: getGridNumericOperators()
              .filter((operator) => operator.value !== 'isAnyOf')
              .map((operator) => ({
                ...operator,
                InputComponent: operator.InputComponent
                  ? RatingInputValue
                  : undefined,
              })),
          };
        }
        return colDef;
      }),
    [data.columns],
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro {...data} loading={loading} columns={columns} headerFilters />
    </div>
  );
}

```

### Header filter row height

By default, the height of the header filter row is the same as the header row (represented by `columnHeaderHeight` prop).
You can use the the `headerFilterHeight` prop to change this:

```tsx
<DataGridPro {...data} headerFilterHeight={52} />
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

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
