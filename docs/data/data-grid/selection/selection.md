# Data Grid - Selection

<p class="description">Selection allows the user to select and highlight a number of rows that they can then take action on.</p>

## Row selection

Row selection can be performed with a simple mouse click, or using the [keyboard shortcuts](/x/react-data-grid/accessibility/#selection). The grid supports single and multiple row selection.

### Single row selection

Single row selection is enabled by default with the `DataGrid` component.
To unselect a row, hold the <kbd class="key">Ctrl</kbd> key and click on it.

{{"demo": "SingleRowSelectionGrid.js", "bg": "inline"}}

### Multiple row selection [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan)

On the `DataGridPro` component, you can select multiple rows in two ways:

- To select multiple independent rows, hold the <kbd class="key">Ctrl</kbd> key while selecting rows.
- To select a range of rows, hold the <kbd class="key">SHIFT</kbd> key while selecting rows.
- To disable multiple row selection, use `disableMultipleRowSelection={true}`.

{{"demo": "MultipleRowSelectionGrid.js", "disableAd": true, "bg": "inline"}}

### Disable row selection on click

You might have interactive content in the cells and need to disable the selection of the row on click. Use the `disableRowSelectionOnClick` prop in this case.

{{"demo": "DisableClickSelectionGrid.js", "bg": "inline"}}

### Disable selection on certain rows

Use the `isRowSelectable` prop to indicate if a row can be selected.
It's called with a `GridRowParams` object and should return a boolean value.
If not specified, all rows are selectable.

In the demo below only rows with quantity above 50000 can be selected:

{{"demo": "DisableRowSelection.js", "bg": "inline"}}

### Controlled row selection

Use the `rowSelectionModel` prop to control the selection.
Each time this prop changes, the `onRowSelectionModelChange` callback is called with the new selection value.

{{"demo": "ControlledSelectionGrid.js", "bg": "inline"}}

## Checkbox selection

To activate checkbox selection set `checkboxSelection={true}`.

{{"demo": "CheckboxSelectionGrid.js", "bg": "inline"}}

### Custom checkbox column

If you provide a custom checkbox column to the grid with the `GRID_CHECKBOX_SELECTION_FIELD` field, the grid will not add its own.

We strongly recommend to use the `GRID_CHECKBOX_SELECTION_COL_DEF` variable instead of re-defining all the custom properties yourself.

In the following demo, the checkbox column has been moved to the right and its width has been increased to 100px.

{{"demo": "CheckboxSelectionCustom.js", "bg": "inline"}}

:::warning
Always set the `checkboxSelection` prop to `true` even when providing a custom checkbox column.
Otherwise, the grid might remove your column.
:::

### Usage with server-side pagination

Using the controlled selection with `paginationMode="server"` may result in selected rows being lost when the page is changed.
This happens because the grid cross-checks with the `rows` prop and only calls `onRowSelectionModelChange` with existing row IDs.
Depending on your server-side implementation, when the page changes and the new value for the `rows` prop does not include previously selected rows, the grid will call `onRowSelectionModelChange` with an empty value.
To prevent this, enable the `keepNonExistentRowsSelected` prop to keep the rows selected even if they do not exist.

```tsx
<DataGrid keepNonExistentRowsSelected />
```

By using this approach, clicking in the **Select All** checkbox may still leave some rows selected.
It is up to you to clean the selection model, using the `rowSelectionModel` prop.
The following demo shows the prop in action:

{{"demo": "ControlledSelectionServerPaginationGrid.js", "bg": "inline"}}

## Cell selection [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan)

The Data Grid has, by default, the ability to select rows.
On the `DataGridPremium`, you can also enable the ability to select cells with the `unstable_cellSelection` prop.

```tsx
<DataGridPremium unstable_cellSelection />
```

:::warning
This feature is not stable yet, meaning that its APIs may suffer breaking changes.
While in development, all props and methods related to cell selection must be prefixed with `unstable_`.
:::

To select a single cell, click on it or, with the cell focused, press <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Space</kbd></kbd>.
Multiple cells can be selected by holding <kbd class="key">Ctrl</kbd> while clicking the cells.
A cell can be deselected by also clicking it while <kbd class="key">Ctrl</kbd> is pressed.

To select all cells within a range, you can use one of the interactions available:

- **Mouse Drag:** Click on a cell, then drag the mouse over another cell and release it
- **Shift + Click**: Click on a cell and, while holding <kbd class="key">Shift</kbd>, click on another cell—if a third cell is clicked the selection will restart from the last clicked cell
- **Shift + Arrow keys**: Using the arrow keys, focus on a cell, then hold <kbd class="key">Shift</kbd> and navigate to another cell—if <kbd class="key">Shift</kbd> is released and pressed again, the selection will restart from the last focused cell

The following demo allows to explore the cell selection feature.
It has row selection disabled, but it's possible to set both selections to work in parallel.

{{"demo": "CellSelectionGrid.js", "bg": "inline"}}

### Controlled cell selection

You can control which cells are selected with the `unstable_cellSelectionModel` prop.
This props accepts an object whose keys are the row IDs that contain selected cells.
The value of each key is another object, which in turn has column fields as keys, each with a boolean value to represent their selection state. You can set `true` to select the cell or `false` to deselect a cell.
Removing the field from the object also deselects the cell.

```tsx
// Selects the cell with field=name from row with id=1
<DataGridPremium
  unstable_cellSelectionModel={{ 1: { name: true } }}
/>

// Unselects the cell with field=name from row with id=1
<DataGridPremium
  unstable_cellSelectionModel={{ 1: { name: false } }}
/>
```

When a new selection is made, the callback passed to the `unstable_onCellSelectionModelChange` prop is called with the updated model.
Use this value to update the current model.

The following demo shows how these props can be combined to create an Excel-like formula field.

{{"demo": "CellSelectionFormulaField.js", "bg": "inline"}}

### Customize range styling

When multiple selected cells make a range, specific class names are applied to the cells at the edges of this range.
The class names applied are the following:

- `MuiDataGrid-cell--rangeTop`: applied to all cells of the first row of the range
- `MuiDataGrid-cell--rangeBottom`: applied to all cells of the last row of the range
- `MuiDataGrid-cell--rangeLeft`: applied to all cells of the first column of the range
- `MuiDataGrid-cell--rangeRight`: applied to all cells of the last column of the range

You can use these classes to create CSS selectors targeting specific corners of each range.
The demo below shows how to add a border around the range.

{{"demo": "CellSelectionRangeStyling.js", "bg": "inline"}}

:::info
If a single cell is selected, all classes above are applied to the same element.
:::

## apiRef [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan)

The grid exposes a set of methods that enables all of these features using the imperative apiRef.

:::warning
Only use this API as the last option. Give preference to the props to control the grid.
:::

{{"demo": "SelectionApiNoSnap.js", "bg": "inline", "hideToolbar": true}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
