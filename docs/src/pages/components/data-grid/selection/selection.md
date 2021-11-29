---
title: Data Grid - Selection
---

# Data Grid - Selection

<p class="description">Selection allows the user to select and highlight a number of rows that they can then take action on.</p>

## Row selection

<!--
- https://ag-grid.com/javascript-grid-selection/
- https://ej2.syncfusion.com/react/demos/#/material/grid/selection
- https://ant.design/components/table/#components-table-demo-row-selection
- https://demos.telerik.com/kendo-ui/grid/selection
- https://www.telerik.com/kendo-react-ui/components/grid/selection/
- https://js.devexpress.com/Demos/WidgetsGallery/Demo/DataGrid/RowSelection/React/Light/
- https://www.jqwidgets.com/react/react-grid/#https://www.jqwidgets.com/react/react-grid/react-grid-rowselection.htm
- http://tabulator.info/docs/4.5/select#setup-range
- https://devexpress.github.io/devextreme-reactive/react/grid/docs/guides/selection/
- https://ej2.syncfusion.com/react/demos/#/material/grid/checkbox-selection
- https://demos.telerik.com/kendo-ui/grid/checkbox-selection
-->

Row selection can be performed with a simple mouse click, or using the [keyboard shortcuts](/components/data-grid/accessibility/#selection). The grid supports single and multiple row selection.

### Single row selection

Single row selection is enable by default with the `DataGrid` component.
To unselect a row, hold the <kbd class="key">CTRL</kbd> key and click on it.

{{"demo": "pages/components/data-grid/selection/SingleRowSelectionGrid.js", "bg": "inline"}}

### Multiple row selection [<span class="plan-pro"></span>](https://mui.com/store/items/material-ui-pro/)

On the `DataGridPro` component, you can select multiple rows in two ways:

- To select multiple independent rows, hold the <kbd class="key">CTRL</kbd> key while selecting rows.
- To select a range of rows, hold the <kbd class="key">SHIFT</kbd> key while selecting rows.
- To disable multiple row selection, use `disableMultipleSelection={true}`.

{{"demo": "pages/components/data-grid/selection/MultipleRowSelectionGrid.js", "disableAd": true, "bg": "inline"}}

## Checkbox selection

To activate checkbox selection set `checkboxSelection={true}`.

{{"demo": "pages/components/data-grid/selection/CheckboxSelectionGrid.js", "bg": "inline"}}

## Disable selection on click

You might have interactive content in the cells and need to disable the selection of the row on click. Use the `disableSelectionOnClick` prop in this case.

{{"demo": "pages/components/data-grid/selection/DisableClickSelectionGrid.js", "bg": "inline"}}

## Disable selection on certain rows

Use the `isRowSelectable` prop to indicate if a row can be selected.
It's called with a `GridRowParams` object and should return a boolean value.
If not specified, all rows are selectable.

In the demo below only rows with quantity above 50000 can be selected:

{{"demo": "pages/components/data-grid/selection/DisableRowSelection.js", "bg": "inline"}}

## Controlled selection

Use the `selectionModel` prop to control the selection.
Each time this prop changes, the `onSelectionModelChange` callback is called with the new selection value.

{{"demo": "pages/components/data-grid/selection/ControlledSelectionGrid.js", "bg": "inline"}}

### Usage with server-side pagination

Using the controlled selection with `paginationMode="server"` may result in selected rows being lost when the page is changed.
This happens because the grid cross-checks with the `rows` prop and only calls `onSelectionModelChange` with existing row IDs.
Depending on your server-side implementation, when the page changes and the new value for the `rows` prop does not include previously selected rows, the grid will call `onSelectionModelChange` with an empty value.
To prevent this unwanted behavior, there are two ways:

- Save the `selectionModel` **before the page is changed** and restore it later
- Append the newly loaded rows to the existing rows

The following demo shows how to implement the first solution:

{{"demo": "pages/components/data-grid/selection/ControlledSelectionServerPaginationGrid.js", "bg": "inline"}}

## apiRef [<span class="plan-pro"></span>](https://mui.com/store/items/material-ui-pro/)

The grid exposes a set of methods that enables all of these features using the imperative apiRef.

> ⚠️ Only use this API when you have no alternative. Always start from the declarative API that the grid exposes.

{{"demo": "pages/components/data-grid/selection/SelectionApiNoSnap.js", "bg": "inline", "hideToolbar": true}}

## 🚧 Range selection [<span class="plan-premium"></span>](https://mui.com/store/items/material-ui-pro/)

> ⚠️ This feature isn't implemented yet. It's coming.
>
> 👍 Upvote [issue #208](https://github.com/mui-org/material-ui-x/issues/208) if you want to see it land faster.

With this feature, you will be able to select ranges of cells across the Grid.

## API

- [DataGrid](/api/data-grid/data-grid/)
- [DataGridPro](/api/data-grid/data-grid-pro/)
