---
title: Data Grid - Column definition
---

# Data Grid - Column definition

<p class="description">Define your columns.</p>

The columns are defined with the `columns` prop which has the type `GridColDef[]`.

`field` is the only required property since it's the column identifier. It's also used to match with `GridRowModel` values.

```ts
interface GridColDef {
  /**
   * The column identifier. It's used to match with [[GridRowModel]] values.
   */
  field: string;
  …
}
```

{{"demo": "BasicColumnsGrid.js", "bg": "inline"}}

> ⚠️ The `columns` prop should keep the same reference between two renders.
> The columns are designed to be definitions, to never change once the component is mounted.
> Otherwise, you take the risk of losing elements like column width or order.
> You can create the array outside the render function or memoize it.

## Column types

To facilitate the configuration of the columns, some column types are predefined.
By default, columns are assumed to hold strings, so the default column string type will be applied. As a result, column sorting will use the string comparator, and the column content will be aligned to the left side of the cell.

The following are the native column types:

- `'string'` (default)
- `'number'`
- `'date'`
- `'dateTime'`
- `'boolean'`
- `'singleSelect'`
- `'actions'`

### Converting types

Default methods, such as filtering and sorting, assume that the type of the values will match the type of the column specified in `type`.
For example, values of column with `type: 'dateTime'` are expecting to be stored as a `Date()` objects.
If for any reason, your data type is not the correct one, you can use `valueGetter` to parse the value to the correct type.

```tsx
{
  field: 'lastLogin',
  type: 'dateTime',
  valueGetter: ({ value }) => value && new Date(value),
}
```

### Special properties

To use most of the column types, you only need to define the `type` property in your column definition.
However, some types require additional properties to be set to make them work correctly:

- If the column type is `'singleSelect'`, you also need to set the `valueOptions` property in the respective column definition. These values are options used for filtering and editing.

  ```tsx
  {
    field: 'country',
    type: 'singleSelect',
    valueOptions: ['United Kingdom', 'Spain', 'Brazil']
  }
  ```

  > ⚠️ When using objects values for `valueOptions` you need to provide `value` and `label` fields for each option: `{ value: string, label: string }`

- If the column type is `'actions'`, you need to provide a `getActions` function that returns an array of actions available for each row (React elements).
  You can add the `showInMenu` prop on the returned React elements to signal the data grid to group these actions inside a row menu.

  ```tsx
  {
    field: 'actions',
    type: 'actions',
    getActions: (params: GridRowParams) => [
      <GridActionsCellItem icon={...} onClick={...} label="Delete" />,
      <GridActionsCellItem icon={...} onClick={...} label="Print" showInMenu />,
    ]
  }
  ```

{{"demo": "ColumnTypesGrid.js", "bg": "inline"}}

## Custom column types

You can extend the native column types with your own by simply spreading the necessary properties.

The demo below defines a new column type: `usdPrice` that extends the native `number` column type.

```ts
const usdPrice: GridColTypeDef = {
  type: 'number',
  width: 130,
  valueFormatter: ({ value }) => valueFormatter.format(Number(value)),
  cellClassName: 'font-tabular-nums',
};
```

{{"demo": "CustomColumnTypesGrid.js", "bg": "inline"}}

> ⚠ If an unsupported column type is used the `string` column type will be used instead.

## Column selector

To enable the toolbar you need to add `Toolbar: GridToolbar` to the grid `components` prop.

In addition, the column selector can be shown by using the "Show columns" menu item in the column menu.

The user can choose which columns are visible using the column selector from the toolbar.

To disable the column selector, set the prop `disableColumnSelector={true}`.

{{"demo": "ColumnSelectorGrid.js", "bg": "inline"}}

## Selectors [<span class="plan-pro"></span>](https://mui.com/store/items/material-ui-pro/)

### Visible columns

Those selectors do not take into account hidden columns.

{{"demo": "VisibleColumnsSelectorsNoSnap.js", "bg": "inline", "hideToolbar": true}}

### Defined columns

Those selectors consider all the defined columns, including hidden ones.

{{"demo": "ColumnsSelectorsNoSnap.js", "bg": "inline", "hideToolbar": true}}

More information about the selectors and how to use them on the [dedicated page](/x/react-data-grid/state/#access-the-state).

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
