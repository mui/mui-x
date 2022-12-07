# Data Grid - Column visibility

<p class="description">Define which columns are visible.</p>

By default, all the columns are visible.
The column's visibility can be switched through the user interface in two ways:

- By opening the column menu and clicking the _Hide_ menu item.
- By clicking the _Columns_ menu and toggling the columns to show or hide.

You can prevent the user from hiding a column through the user interface by setting the `hideable` in `GridColDef` to `false`.

In the following demo, the "username" column cannot be hidden.

{{"demo": "VisibleColumnsBasicExample.js", "bg": "inline"}}

## Initialize the visible columns

To initialize the visible columns without controlling them, provide the model to the `initialState` prop.

```tsx
<DataGrid
  initialState={{
    columns: {
      columnVisibilityModel: {
        // Hide columns status and traderName, the other columns will remain visible
        status: false,
        traderName: false,
      },
    },
  }}
/>
```

{{"demo": "VisibleColumnsModelInitialState.js", "bg": "inline", "defaultCodeOpen": false }}

## Controlled visible columns

Use the `columnVisibilityModel` prop to control the visible columns.
You can use the `onColumnVisibilityModelChange` prop to listen to the changes to the visible columns and update the prop accordingly.

```tsx
<DataGrid
  columnVisibilityModel={{
    // Hide columns status and traderName, the other columns will remain visible
    status: false,
    traderName: false,
  }}
/>
```

{{"demo": "VisibleColumnsModelControlled.js", "bg": "inline"}}

## Column visibility panel

The column visibility panel can be opened through the grid toolbar.
To enable it, you need to add `Toolbar: GridToolbar` to the grid `components` prop.

The user can then choose which columns are visible using the _Columns_ button.

{{"demo": "ColumnSelectorGrid.js", "bg": "inline"}}

### Disable action buttons

To disable `Hide all` or `Show all` buttons in column visibility panel, pass `disableHideAllButton` or `disableShowAllButton` in `componentsProps.columnsPanel`.

```tsx
<DataGrid
  components={{
    Toolbar: GridToolbar,
  }}
  componentsProps={{
    columnsPanel: {
      disableHideAllButton: true,
      disableShowAllButton: true,
    },
  }}
/>
```

:::info
To hide the column visibility panel from the toolbar, set the prop `disableColumnSelector={true}`.
:::

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
