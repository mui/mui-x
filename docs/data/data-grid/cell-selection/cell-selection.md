---
title: Data Grid - Cell selection
---

# Data Grid - Cell selection [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

<p class="description">Let users select individual cells or a range of cells.</p>

## Enabling cell selection

By default, the Data Grid lets users select individual rows.
With the Data Grid Premium, you can apply the `cellSelection` prop to let users select individual cells or ranges of cells.

```tsx
<DataGridPremium cellSelection />
```

## Selecting cells

With the `cellSelection` prop applied, users can select a single cell by clicking on it, or by pressing <kbd class="key">Space</kbd> when the cell is in focus.
Select multiple cells by holding <kbd class="key">Cmd</kbd> (or <kbd class="key">Ctrl</kbd> on Windows) while clicking on them.
Hold <kbd class="key">Cmd</kbd> (or <kbd class="key">Ctrl</kbd> on Windows) and click on a selected cell to deselect it.

To select a range of cells, users can:

- Click on a cell, drag the mouse over nearby cells, and then release.
- Click on a cell, then hold <kbd class="key">Shift</kbd> and click on another cell. If a third cell is clicked then the selection will restart from the last clicked cell.
- Use the arrow keys to focus on a cell, then hold <kbd class="key">Shift</kbd> and press the arrow keys to extend the selection.
  <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Home</kbd></kbd> and <kbd><kbd class="key">Shift</kbd>+<kbd class="key">End</kbd></kbd> extend it to the first or last cell of the row, and <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Page Up</kbd></kbd> and <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Page Down</kbd></kbd> by one scrollable page.
  When all the cells of the focused row are selected, <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Arrow Up</kbd></kbd> and <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Arrow Down</kbd></kbd> extend the selection by whole rows.

To select all cells, press <kbd><kbd class="key">Cmd</kbd>+<kbd class="key">A</kbd></kbd> (or <kbd><kbd class="key">Ctrl</kbd>+<kbd class="key">A</kbd></kbd> on Windows) while a cell is in focus.
The shortcut selects the cells of all rows on the current page.
Utility columns, such as the checkbox selection column, are not included.
When both cell selection and row selection are enabled, this shortcut selects cells instead of rows.

To deselect all cells, press <kbd class="key">Esc</kbd> while a cell is in focus.
When row selection is enabled, the selected rows are deselected too.

Try out the various actions to select cells in the demo below—you can toggle [row selection](/x/react-data-grid/row-selection/) on and off to see how these two selection features can work in parallel.

{{"demo": "CellSelectionGrid.js", "bg": "inline"}}

### Selecting rows with the keyboard

When both cell selection and row selection are enabled, pressing <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Space</kbd></kbd> selects the focused cell and selects or deselects its row.
To act on the rows only, also hold <kbd class="key">Cmd</kbd> (or <kbd class="key">Ctrl</kbd> on Windows):

- <kbd><kbd class="key">Cmd</kbd>+<kbd class="key">Shift</kbd>+<kbd class="key">Space</kbd></kbd> selects or deselects the focused row.
- <kbd><kbd class="key">Cmd</kbd>+<kbd class="key">Shift</kbd>+<kbd class="key">Arrow Up</kbd></kbd> and <kbd><kbd class="key">Cmd</kbd>+<kbd class="key">Shift</kbd>+<kbd class="key">Arrow Down</kbd></kbd> extend the selected rows to the row above or below.
  With <kbd class="key">Page Up</kbd>, <kbd class="key">Page Down</kbd>, <kbd class="key">Home</kbd>, and <kbd class="key">End</kbd>, they extend by one scrollable page, or to the first or last row.

The selected cells are kept when rows are selected.

When row selection is disabled, these shortcuts select all the cells of the rows instead.
<kbd><kbd class="key">Shift</kbd>+<kbd class="key">Space</kbd></kbd> then also selects all the cells of the focused row, or of all the rows in the selected range.

See the [accessibility](/x/react-data-grid/accessibility/#selection) page for the full list of keyboard shortcuts.

## Controlling cell selection

You can control which cells are selected using the `cellSelectionModel` prop.
This prop accepts an object with keys corresponding to the row IDs that contain selected cells.
The value of each key is itself an object, which has a column field for a key and a boolean value for its selection state.
You can set this to `true` to select a cell or `false` to deselect it.
Removing the field from the object also deselects the cell.

```tsx
// Selects the cell with field=name from row with id=1
<DataGridPremium cellSelectionModel={{ 1: { name: true } }} />

// Unselects the cell with field=name from row with id=1
<DataGridPremium cellSelectionModel={{ 1: { name: false } }} />
```

When a new selection is made, the callback passed to the `onCellSelectionModelChange` prop is called with the updated model.
Use this value to update the current model.

The following demo shows how these props can be combined to create an Excel-like formula field—try updating multiple cells at once by selecting them and entering a new value in the field at the top.

{{"demo": "CellSelectionFormulaField.js", "bg": "inline"}}

## Customizing range styles

When multiple selected cells form a continuous range of any size, the following class names are applied to the cells at the edges:

- `MuiDataGrid-cell--rangeTop`: to all cells in the first row of the range
- `MuiDataGrid-cell--rangeBottom`: to all cells in the last row of the range
- `MuiDataGrid-cell--rangeLeft`: to all cells in the first column of the range
- `MuiDataGrid-cell--rangeRight`: to all cells in the last column of the range

:::info
When a single cell is selected, all classes above are applied to that element.
:::

You can use these classes to create CSS selectors targeting specific corners of each range—for example, the demo below adds a border around the outside of the range.

{{"demo": "CellSelectionRangeStyling.js", "bg": "inline"}}

## apiRef

The Data Grid exposes a set of methods via the `apiRef` object that are used internally in the implementation of the cell selection feature.
The reference below describes the relevant functions.
See [API object](/x/react-data-grid/api-object/) for more details.

:::warning
This API should only be used as a last resort when the Data Grid's built-in props aren't sufficient for your specific use case.
:::

{{"demo": "CellSelectionApiNoSnap.js", "bg": "inline", "hideToolbar": true}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
