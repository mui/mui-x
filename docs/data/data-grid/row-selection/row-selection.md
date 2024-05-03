# Data Grid - Row selection

<p class="description">Row selection allows the user to select and highlight a single or multiple rows that they can then take action on.</p>

## Single row selection

Single row selection comes enabled by default for the MIT `DataGrid` component.
You can select a row by clicking it, or using the [keyboard shortcuts](/x/react-data-grid/accessibility/#selection).
To unselect a row, hold the <kbd class="key">Ctrl</kbd> (<kbd class="key">Cmd</kbd> on MacOS) key and click on it.

{{"demo": "SingleRowSelectionGrid.js", "bg": "inline"}}

## Multiple row selection [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

On the `DataGridPro` and `DataGridPremium` components, you can select multiple rows in two ways:

- To select multiple independent rows, hold the <kbd class="key">Ctrl</kbd> (<kbd class="key">Cmd</kbd> on MacOS) key while selecting rows.
- To select a range of rows, hold the <kbd class="key">Shift</kbd> key while selecting rows.
- To disable multiple row selection, use `disableMultipleRowSelection={true}`.

{{"demo": "MultipleRowSelectionGrid.js", "disableAd": true, "bg": "inline"}}

## Disable row selection on click

You might have interactive content in the cells and need to disable the selection of the row on click. Use the `disableRowSelectionOnClick` prop in this case.

{{"demo": "DisableClickSelectionGrid.js", "bg": "inline"}}

## Disable selection on certain rows

Use the `isRowSelectable` prop to indicate if a row can be selected.
It's called with a `GridRowParams` object and should return a boolean value.
If not specified, all rows are selectable.

In the demo below only rows with quantity above 50,000 can be selected:

{{"demo": "DisableRowSelection.js", "bg": "inline"}}

## Controlled row selection

Use the `rowSelectionModel` prop to control the selection.
Each time this prop changes, the `onRowSelectionModelChange` callback is called with the new selection value.

{{"demo": "ControlledSelectionGrid.js", "bg": "inline"}}

## Checkbox selection

To activate checkbox selection set `checkboxSelection={true}`.

{{"demo": "CheckboxSelectionGrid.js", "bg": "inline"}}

### Custom checkbox column

If you provide a custom checkbox column to the data grid with the `GRID_CHECKBOX_SELECTION_FIELD` field, the data grid will not add its own.

We strongly recommend to use the `GRID_CHECKBOX_SELECTION_COL_DEF` variable instead of re-defining all the custom properties yourself.

In the following demo, the checkbox column has been moved to the right and its width has been increased to 100px.

{{"demo": "CheckboxSelectionCustom.js", "bg": "inline"}}

:::warning
Always set the `checkboxSelection` prop to `true` even when providing a custom checkbox column.
Otherwise, the data grid might remove your column.
:::

### Visible rows selection [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

By default, when you click the "Select All" checkbox, all rows in the data grid are selected.
If you want to change this behavior and only select the rows that are currently visible on the page, you can use the `checkboxSelectionVisibleOnly` prop.

{{"demo": "CheckboxSelectionVisibleOnlyGrid.js", "bg": "inline"}}

## Usage with server-side pagination

Using the controlled selection with `paginationMode="server"` may result in selected rows being lost when the page is changed.
This happens because the data grid cross-checks with the `rows` prop and only calls `onRowSelectionModelChange` with existing row IDs.
Depending on your server-side implementation, when the page changes and the new value for the `rows` prop does not include previously selected rows, the data grid will call `onRowSelectionModelChange` with an empty value.
To prevent this, enable the `keepNonExistentRowsSelected` prop to keep the rows selected even if they do not exist.

```tsx
<DataGrid keepNonExistentRowsSelected />
```

By using this approach, clicking in the **Select All** checkbox may still leave some rows selected.
It is up to you to clean the selection model, using the `rowSelectionModel` prop.
The following demo shows the prop in action:

{{"demo": "ControlledSelectionServerPaginationGrid.js", "bg": "inline"}}

## apiRef

The grid exposes a set of methods that enables all of these features using the imperative `apiRef`. To know more about how to use it, check the [API Object](/x/react-data-grid/api-object/) section.

:::warning
Only use this API as the last option. Give preference to the props to control the Data Grid.
:::

{{"demo": "RowSelectionApiNoSnap.js", "bg": "inline", "hideToolbar": true}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
