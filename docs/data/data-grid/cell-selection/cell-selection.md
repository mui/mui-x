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

With the `cellSelection` prop applied, users can select a single cell by clicking on it, or by pressing <kbd class="key">Shift</kbd>+<kbd class="key">Space</kbd> when the cell is in focus.
Select multiple cells by holding <kbd class="key">Cmd</kbd> (or <kbd class="key">Ctrl</kbd> on Windows) while clicking on them.
Hold <kbd class="key">Cmd</kbd> (or <kbd class="key">Ctrl</kbd> on Windows) and click on a selected cell to deselect it.

To select a range of cells, users can:

- Click on a cell, drag the mouse over nearby cells, and then release.
- Click on a cell, then hold <kbd class="key">Shift</kbd> and click on another cell. If a third cell is clicked then the selection will restart from the last clicked cell.
- Use the arrow keys to focus on a cell, then hold <kbd class="key">Shift</kbd> and navigate to another cell—if <kbd class="key">Shift</kbd> is released and pressed again then the selection will restart from the last focused cell.

Try out the various actions to select cells in the demo below—you can toggle [row selection](/x/react-data-grid/row-selection/) on and off to see how these two selection features can work in parallel.

{{"demo": "CellSelectionGrid.js", "bg": "inline"}}

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

The Data Grid exposes a set of methods via the `apiRef` object that are used in the implementation of the cell selection feature.
The reference below describes the relevant functions.
See [API object](/x/react-data-grid/api-object/) for more details.

:::warning
This API should only be used as a last resort—give preference to props for controlling the Data Grid.
:::

{{"demo": "CellSelectionApiNoSnap.js", "bg": "inline", "hideToolbar": true}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
