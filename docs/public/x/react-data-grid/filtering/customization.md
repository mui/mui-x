# Data Grid - Filter customization

Ways to customize your filters.

## Customize the operators

The full typing details can be found on the [GridFilterOperator API page](/x/api/data-grid/grid-filter-operator/).

An operator determines if a cell value should be considered as a valid filtered value.
The candidate value used by the operator is the one corresponding to the `field` attribute or the value returned by the `valueGetter` of the `GridColDef`.

Each column type comes with a default array of operators.
You can get them by importing the following functions:

| Column type    | Function                         |
| :------------- | :------------------------------- |
| `string`       | `getGridStringOperators()`       |
| `number`       | `getGridNumericOperators()`      |
| `boolean`      | `getGridBooleanOperators()`      |
| `date`         | `getGridDateOperators()`         |
| `dateTime`     | `getGridDateOperators(true)`     |
| `singleSelect` | `getGridSingleSelectOperators()` |

You can find more information about the supported column types in the [columns section](/x/react-data-grid/column-definition/#column-types).

### Create a custom operator

If the built-in filter operators are not enough, creating a custom operator is an option.
A custom operator is defined by creating a `GridFilterOperator` object.
This object has to be added to the `filterOperators` attribute of the `GridColDef`.

The main part of an operator is the `getApplyFilterFn` function.
When applying the filters, the Data Grid will call this function with the filter item and the column on which the item must be applied.
This function must return another function that takes the cell value as an input and return `true` if it satisfies the operator condition.

```ts
const operator: GridFilterOperator<any, number> = {
  label: 'From',
  value: 'from',
  getApplyFilterFn: (filterItem, column) => {
    if (!filterItem.field || !filterItem.value || !filterItem.operator) {
      return null;
    }

    return (value, row, column, apiRef) => {
      return Number(value) >= Number(filterItem.value);
    };
  },
  InputComponent: RatingInputValue,
  InputComponentProps: { type: 'number' },
};
```

:::info
The [`valueFormatter`](/x/react-data-grid/column-definition/#value-formatter) is only used for rendering purposes.
:::

:::info
If the column has a [`valueGetter`](/x/react-data-grid/column-definition/#value-getter), then `params.value` will be the resolved value.
:::

:::info
The filter button displays a tooltip on hover if there are active filters. Pass [`getValueAsString`](/x/api/data-grid/grid-filter-operator/) in the filter operator to customize or convert the value to a more human-readable form.
:::

In the demo below, you can see how to create a completely new operator for the Rating column.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Rating, { RatingProps } from '@mui/material/Rating';
import {
  GridFilterInputValueProps,
  DataGrid,
  GridFilterOperator,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

function RatingInputValue(props: GridFilterInputValueProps) {
  const { item, applyValue, focusElementRef } = props;

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
        display: 'inline-flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        pl: '20px',
      }}
    >
      <Rating
        name="custom-rating-filter-operator"
        value={Number(item.value)}
        onChange={handleFilterChange}
        precision={0.5}
        ref={ratingRef}
      />
    </Box>
  );
}

const ratingOnlyOperators: GridFilterOperator<any, number>[] = [
  {
    label: 'Above',
    value: 'above',
    getApplyFilterFn: (filterItem) => {
      if (!filterItem.field || !filterItem.value || !filterItem.operator) {
        return null;
      }
      return (value) => {
        return Number(value) >= Number(filterItem.value);
      };
    },
    InputComponent: RatingInputValue,
    getValueAsString: (value: number) => `${value} Stars`,
  },
];

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

export default function CustomRatingOperator() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  const columns = React.useMemo(
    () =>
      data.columns.map((col) =>
        col.field === 'rating'
          ? {
              ...col,
              filterOperators: ratingOnlyOperators,
            }
          : col,
      ),
    [data.columns],
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        columns={columns}
        showToolbar
        initialState={{
          ...data.initialState,
          filter: {
            ...data.initialState?.filter,
            filterModel: {
              items: [
                {
                  id: 1,
                  field: 'rating',
                  value: '3.5',
                  operator: 'above',
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

### Wrap built-in operators

You can create custom operators that re-use the logic of the built-in ones.

In the demo below, the selected rows are always visible even when they don't match the filtering rules.

```tsx
import * as React from 'react';
import {
  DataGrid,
  GridFilterOperator,
  getGridDefaultColumnTypes,
  DEFAULT_GRID_COL_TYPE_KEY,
  gridRowSelectionManagerSelector,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

const defaultColumnTypes = getGridDefaultColumnTypes();

export default function CustomSelectionOperator() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  const columns = React.useMemo(() => {
    /**
     * Function that takes an operator and wrap it to skip filtering for selected rows.
     */
    const wrapOperator = (operator: GridFilterOperator) => {
      const getApplyFilterFn: GridFilterOperator['getApplyFilterFn'] = (
        filterItem,
        column,
      ) => {
        const innerFilterFn = operator.getApplyFilterFn(filterItem, column);
        if (!innerFilterFn) {
          return innerFilterFn;
        }

        return (value, row, col, apiRef) => {
          const rowId = apiRef.current.getRowId(row);
          const rowSelectionManager = gridRowSelectionManagerSelector(apiRef);
          if (rowSelectionManager.has(rowId)) {
            return true;
          }

          return innerFilterFn(value, row, col, apiRef);
        };
      };

      return {
        ...operator,
        getApplyFilterFn,
      };
    };

    return data.columns.map((col) => {
      const filterOperators =
        col.filterOperators ??
        defaultColumnTypes[col.type ?? DEFAULT_GRID_COL_TYPE_KEY].filterOperators!;

      return {
        ...col,
        filterOperators: filterOperators.map((operator) => wrapOperator(operator)),
      };
    });
  }, [data.columns]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid {...data} loading={loading} columns={columns} />
    </div>
  );
}

```

### Multiple values operator

You can create a custom operator which accepts multiple values. To do this, provide an array of values to the `value` property of the `filterItem`.
The `valueParser` of the `GridColDef` will be applied to each item of the array.

The filtering function `getApplyFilterFn` must be adapted to handle `filterItem.value` as an array.
Below is an example for a "between" operator, applied on the "Quantity" column.

```ts
const operator: GridFilterOperator<any, number> = {
  label: 'Between',
  value: 'between',
  getApplyFilterFn: (filterItem) => {
    if (!Array.isArray(filterItem.value) || filterItem.value.length !== 2) {
      return null;
    }
    if (filterItem.value[0] == null || filterItem.value[1] == null) {
      return null;
    }
    return (value) => {
      return (
        value != null && filterItem.value[0] <= value && value <= filterItem.value[1]
      );
    };
  },
  InputComponent: InputNumberInterval,
};
```

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import {
  GridFilterInputValueProps,
  DataGrid,
  GridFilterModel,
  GridFilterOperator,
  useGridRootProps,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import SyncIcon from '@mui/icons-material/Sync';

function InputNumberInterval(props: GridFilterInputValueProps) {
  const rootProps = useGridRootProps();
  const { item, applyValue, focusElementRef = null } = props;

  const filterTimeout = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  const [filterValueState, setFilterValueState] = React.useState<[string, string]>(
    item.value ?? '',
  );
  const [applying, setIsApplying] = React.useState(false);

  React.useEffect(() => {
    return () => {
      clearTimeout(filterTimeout.current);
    };
  }, []);

  React.useEffect(() => {
    const itemValue = item.value ?? [undefined, undefined];
    setFilterValueState(itemValue);
  }, [item.value]);

  const updateFilterValue = (lowerBound: string, upperBound: string) => {
    clearTimeout(filterTimeout.current);
    setFilterValueState([lowerBound, upperBound]);

    setIsApplying(true);
    filterTimeout.current = setTimeout(() => {
      setIsApplying(false);
      applyValue({ ...item, value: [lowerBound, upperBound] });
    }, rootProps.filterDebounceMs);
  };

  const handleUpperFilterChange: TextFieldProps['onChange'] = (event) => {
    const newUpperBound = event.target.value;
    updateFilterValue(filterValueState[0], newUpperBound);
  };
  const handleLowerFilterChange: TextFieldProps['onChange'] = (event) => {
    const newLowerBound = event.target.value;
    updateFilterValue(newLowerBound, filterValueState[1]);
  };

  return (
    <Box
      sx={{
        display: 'inline-flex',
        flexDirection: 'row',
        alignItems: 'end',
        height: 48,
        pl: '20px',
      }}
    >
      <TextField
        name="lower-bound-input"
        placeholder="From"
        label="From"
        variant="standard"
        value={Number(filterValueState[0])}
        onChange={handleLowerFilterChange}
        type="number"
        inputRef={focusElementRef}
        sx={{ mr: 2 }}
      />
      <TextField
        name="upper-bound-input"
        placeholder="To"
        label="To"
        variant="standard"
        value={Number(filterValueState[1])}
        onChange={handleUpperFilterChange}
        type="number"
        InputProps={applying ? { endAdornment: <SyncIcon /> } : {}}
      />
    </Box>
  );
}

const quantityOnlyOperators: GridFilterOperator<any, number>[] = [
  {
    label: 'Between',
    value: 'between',
    getApplyFilterFn: (filterItem) => {
      if (!Array.isArray(filterItem.value) || filterItem.value.length !== 2) {
        return null;
      }
      if (filterItem.value[0] == null || filterItem.value[1] == null) {
        return null;
      }
      return (value) => {
        return (
          value !== null &&
          filterItem.value[0] <= value &&
          value <= filterItem.value[1]
        );
      };
    },
    InputComponent: InputNumberInterval,
  },
];

export default function CustomMultiValueOperator() {
  const { data, loading } = useDemoData({ dataSet: 'Commodity', rowLength: 100 });

  const [filterModel, setFilterModel] = React.useState<GridFilterModel>({
    items: [
      {
        id: 1,
        field: 'quantity',
        value: [5000, 15000],
        operator: 'between',
      },
    ],
  });

  const columns = React.useMemo(() => {
    const newColumns = [...data.columns];

    if (newColumns.length > 0) {
      const index = newColumns.findIndex((col) => col.field === 'quantity');
      const quantityColumn = newColumns[index];

      newColumns[index] = {
        ...quantityColumn,
        filterOperators: quantityOnlyOperators,
      };
    }

    return newColumns;
  }, [data.columns]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        columns={columns}
        filterModel={filterModel}
        onFilterModelChange={(model) => setFilterModel(model)}
      />
    </div>
  );
}

```

### Remove an operator

To remove built-in operators, import the method to generate them and filter the output to fit your needs.

```ts
// Only keep '>' and '<' default operators
const filterOperators = getGridNumericOperators().filter(
  (operator) => operator.value === '>' || operator.value === '<',
);
```

In the demo below, the `rating` column only has the `<` and `>` operators.

```tsx
import * as React from 'react';
import { DataGrid, getGridNumericOperators } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

export default function RemoveBuiltInOperators() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    rowLength: 100,
    visibleFields: VISIBLE_FIELDS,
  });

  const columns = React.useMemo(
    () =>
      data.columns.map((col) => {
        if (col.field !== 'rating') {
          return col;
        }

        return {
          ...col,
          filterOperators: getGridNumericOperators().filter(
            (operator) => operator.value === '>' || operator.value === '<',
          ),
        };
      }),
    [data.columns],
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        columns={columns}
        initialState={{
          ...data.initialState,
          filter: {
            ...data.initialState?.filter,
            filterModel: {
              items: [{ field: 'unitPrice', value: '25', operator: '>' }],
            },
          },
        }}
      />
    </div>
  );
}

```

### Custom input component

The value used by the operator to look for has to be entered by the user.
On most column types, a text field is used.
However, a custom component can be rendered instead.

In the demo below, the `rating` column reuses the numeric operators but the rating component is used to enter the value of the filter.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Rating, { RatingProps } from '@mui/material/Rating';
import {
  DataGrid,
  GridFilterInputValueProps,
  getGridNumericOperators,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

function RatingInputValue(props: GridFilterInputValueProps) {
  const { item, applyValue, focusElementRef } = props;

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
        display: 'inline-flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        pl: '20px',
      }}
    >
      <Rating
        name="custom-rating-filter-operator"
        value={Number(item.value)}
        onChange={handleFilterChange}
        precision={0.5}
        ref={ratingRef}
      />
    </Box>
  );
}

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

export default function CustomInputComponent() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  const columns = React.useMemo(
    () =>
      data.columns.map((col) => {
        if (col.field === 'rating') {
          return {
            ...col,
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
        return col;
      }),
    [data.columns],
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={data.rows}
        columns={columns}
        loading={loading}
        initialState={{
          ...data.initialState,
          filter: {
            ...data.initialState?.filter,
            filterModel: {
              items: [{ id: 1, field: 'rating', value: '3.5', operator: '>=' }],
            },
          },
        }}
      />
    </div>
  );
}

```

### Custom column types

When defining a [custom column type](/x/react-data-grid/column-definition/#custom-column-types), by default the Data Grid will reuse the operators from the type that was extended.
The filter operators can then be edited just like on a regular column.

```ts
const ratingColumnType: GridColTypeDef = {
  type: 'number',
  filterOperators: getGridNumericOperators().filter(
    (operator) => operator.value === '>' || operator.value === '<',
  ),
};
```

## Custom filter panel

You can customize the rendering of the filter panel as shown in [the component section](/x/react-data-grid/components/#component-slots) of the documentation.

### Customize the filter panel content

The customization of the filter panel content can be performed by passing props to the default [`<GridFilterPanel />`](/x/api/data-grid/grid-filter-panel/) component.
The available props allow overriding:

- The `logicOperators` (can contains `GridLogicOperator.And` and `GridLogicOperator.Or`)
- The order of the column selector (can be `"asc"` or `"desc"`)
- Any prop of the input components

Input components can be [customized](/material-ui/customization/how-to-customize/) by using two approaches.
You can pass a `sx` prop to any input container or you can use CSS selectors on nested components of the filter panel.
More details are available in the demo.

| Props                     | CSS class                                  |
| :------------------------ | :----------------------------------------- |
| `deleteIconProps`         | `MuiDataGrid-filterFormDeleteIcon`         |
| `logicOperatorInputProps` | `MuiDataGrid-filterFormLogicOperatorInput` |
| `columnInputProps`        | `MuiDataGrid-filterFormColumnInput`        |
| `operatorInputProps`      | `MuiDataGrid-filterFormOperatorInput`      |
| `valueInputProps`         | `MuiDataGrid-filterFormValueInput`         |

The value input is a special case, because it can contain a wide variety of components (the one provided or [your custom `InputComponent`](#create-a-custom-operator)).
To pass props directly to the `InputComponent` and not its wrapper, you can use `valueInputProps.InputComponentProps`.

```tsx
import * as React from 'react';
import { DataGridPro, GridLogicOperator } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';
import type { Theme } from '@mui/material/styles';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

export default function CustomFilterPanelContent() {
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
        slots={
          {
            // Use custom FilterPanel only for deep modification
            // FilterPanel: MyCustomFilterPanel,
          }
        }
        slotProps={{
          filterPanel: {
            // Force usage of "And" operator
            logicOperators: [GridLogicOperator.And],
            // Display columns by ascending alphabetical order
            columnsSort: 'asc',
            filterFormProps: {
              // Customize inputs by passing props
              logicOperatorInputProps: {
                variant: 'outlined',
                size: 'small',
              },
              columnInputProps: {
                variant: 'outlined',
                size: 'small',
                sx: { mt: 'auto' },
              },
              operatorInputProps: {
                variant: 'outlined',
                size: 'small',
                sx: { mt: 'auto' },
              },
              valueInputProps: {
                InputComponentProps: {
                  variant: 'outlined',
                  size: 'small',
                },
              },
              deleteIconProps: {
                sx: {
                  '& .MuiSvgIcon-root': { color: '#d32f2f' },
                },
              },
            },
            sx: {
              // Customize inputs using css selectors
              '& .MuiDataGrid-filterForm': { p: 2 },
              '& .MuiDataGrid-filterForm:nth-child(even)': {
                backgroundColor: (theme: Theme) =>
                  theme.palette.mode === 'dark' ? '#444' : '#f5f5f5',
              },
              '& .MuiDataGrid-filterFormLogicOperatorInput': { mr: 2 },
              '& .MuiDataGrid-filterFormColumnInput': { mr: 2, width: 150 },
              '& .MuiDataGrid-filterFormOperatorInput': { mr: 2 },
              '& .MuiDataGrid-filterFormValueInput': { width: 200 },
            },
          },
        }}
        initialState={{
          ...data.initialState,
          filter: {
            ...data.initialState?.filter,
            filterModel: {
              items: [
                {
                  id: 1,
                  field: 'name',
                  operator: 'contains',
                  value: 'D',
                },
                {
                  id: 2,
                  field: 'name',
                  operator: 'contains',
                  value: 'D',
                },
                {
                  id: 3,
                  field: 'rating',
                  operator: '>',
                  value: '0',
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

### Customize the filter panel position

The demo below shows how to anchor the filter panel to the toolbar button instead of the column header.

```tsx
import * as React from 'react';
import {
  DataGrid,
  GridSlotProps,
  Toolbar,
  ToolbarButton,
  FilterPanelTrigger,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import Tooltip from '@mui/material/Tooltip';
import FilterListIcon from '@mui/icons-material/FilterList';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    setFilterButtonEl: React.Dispatch<
      React.SetStateAction<HTMLButtonElement | null>
    >;
  }
}

function CustomToolbar({ setFilterButtonEl }: GridSlotProps['toolbar']) {
  return (
    <Toolbar>
      <Tooltip title="Filters">
        <FilterPanelTrigger render={<ToolbarButton />} ref={setFilterButtonEl}>
          <FilterListIcon fontSize="small" />
        </FilterPanelTrigger>
      </Tooltip>
    </Toolbar>
  );
}

export default function CustomFilterPanelPosition() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  const [filterButtonEl, setFilterButtonEl] =
    React.useState<HTMLButtonElement | null>(null);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        slots={{ toolbar: CustomToolbar }}
        showToolbar
        slotProps={{
          panel: {
            target: filterButtonEl,
          },
          toolbar: { setFilterButtonEl },
        }}
      />
    </div>
  );
}

```

## API

- [GridFilterOperator](/x/api/data-grid/grid-filter-operator/)
- [GridFilterItem](/x/api/data-grid/grid-filter-item/)
- [GridFilterPanel](/x/api/data-grid/grid-filter-panel/)
- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
