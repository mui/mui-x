---
title: Data Grid - Editing
components: DataGrid, XGrid
---

# Data Grid - Editing

<p class="description">The data grid provides allows performing: create, read, update, and delete operations (CRUD).</p>

## Cell editing

Cell editing allows to edit the value of one cell at a time.
To activate editing on cells, set the `editable` property of the column definition `GridColDef` object to true.

```tsx
<DataGrid columns={[{ field: 'name', editable: true }]} />
```

By default, a cell can turn into edit mode by double-clicking on it, or using <kbd class="key">Enter</kbd> key, if the cell has focus.

{{"demo": "pages/components/data-grid/editing/BasicEditingGrid.js", "bg": "inline", "defaultCodeOpen": true}}

### Control cell editability

In addition to the `editable` flag on columns, you can control which cell is editable using `isCellEditable` prop.

In the demo below, the column `name` is not editable, and only the rows with an even `age` value are editable.
To make it more visible, we applied a green background on the editable cells.

{{"demo": "pages/components/data-grid/editing/IsCellEditableGrid.js", "bg": "inline"}}

### Validating new values


{{"demo": "pages/components/data-grid/editing/IsCellEditableGrid.js", "bg": "inline"}}

## 🚧 Row editing

> ⚠️ This feature isn't implemented yet. It's coming.
>
> 👍 Upvote [issue #204](https://github.com/mui-org/material-ui-x/issues/204) if you want to see it land faster.

Row editing allows to edit all the cells of a row at once.
The edition can be performed directly in the cells or in a popup or a modal.
