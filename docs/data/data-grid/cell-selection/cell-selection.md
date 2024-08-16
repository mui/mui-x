---
title: Data Grid - Cell selection
---

# Data Grid - Cell selection [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

<p class="description">Cell selection allows the user to select individual cells or a range of cells.</p>

The Data Grid has, by default, the ability to select rows.
On the `DataGridPremium`, you can also enable the ability to select cells with the `cellSelection` prop.

```tsx
<DataGridPremium cellSelection />
```

To select a single cell, click on it or, with the cell focused, press <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Space</kbd></kbd>.
Multiple cells can be selected by holding <kbd class="key">Ctrl</kbd> while clicking the cells.
A cell can be deselected by also clicking it while <kbd class="key">Ctrl</kbd> is pressed.

To select all cells within a range, you can use one of the interactions available:

- **Mouse drag:** Click on a cell, then drag the mouse over another cell and release it
- **Shift + click**: Click on a cell and, while holding <kbd class="key">Shift</kbd>, click on another cell—if a third cell is clicked the selection will restart from the last clicked cell
- **Shift + arrow keys**: Using the arrow keys, focus on a cell, then hold <kbd class="key">Shift</kbd> and navigate to another cell—if <kbd class="key">Shift</kbd> is released and pressed again, the selection will restart from the last focused cell

The following demo allows to explore the cell selection feature.
It has [row selection](/x/react-data-grid/row-selection/) disabled, but it's possible to set both selections to work in parallel.

{{"demo": "CellSelectionGrid.js", "bg": "inline"}}

## Controlled cell selection

You can control which cells are selected with the `cellSelectionModel` prop.
This props accepts an object whose keys are the row IDs that contain selected cells.
The value of each key is another object, which in turn has column fields as keys, each with a boolean value to represent their selection state. You can set `true` to select the cell or `false` to deselect a cell.
Removing the field from the object also deselects the cell.

```tsx
// Selects the cell with field=name from row with id=1
<DataGridPremium cellSelectionModel={{ 1: { name: true } }} />

// Unselects the cell with field=name from row with id=1
<DataGridPremium cellSelectionModel={{ 1: { name: false } }} />
```

When a new selection is made, the callback passed to the `onCellSelectionModelChange` prop is called with the updated model.
Use this value to update the current model.

The following demo shows how these props can be combined to create an Excel-like formula field.

{{"demo": "CellSelectionFormulaField.js", "bg": "inline"}}

## Customize range styling

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

## apiRef

The grid exposes a set of methods that enables all of these features using the imperative `apiRef`. To know more about how to use it, check the [API Object](/x/react-data-grid/api-object/) section.

:::warning
Only use this API as the last option. Give preference to the props to control the Data Grid.
:::

{{"demo": "CellSelectionApiNoSnap.js", "bg": "inline", "hideToolbar": true}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
