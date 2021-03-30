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

### Start Editing

By default, a cell can turn into edit mode by double-clicking on it, or using the keyboard shortcuts.
If the cell has focus.

- Start typing any alpha keys
- Press <kbd class="key">Enter</kbd> to switch to edit mode
- Press <kbd class="key">Delete</kbd> to delete the value

{{"demo": "pages/components/data-grid/editing/BasicEditingGrid.js", "bg": "inline", "defaultCodeOpen": false}}

### Stop Editing

- Click outside the cell
- <kbd class="key">Escape</kbd> to rollback changes.
- <kbd class="key">Tab</kbd> to save and goes to next cell.
- <kbd class="key">Enter</kbd> to save and goes to next cell below.

### Control cell editability

In addition to the `editable` flag on columns, you can control which cell is editable using `isCellEditable` prop.

In the demo below, the column `name` is not editable, and only the rows with an even `age` value are editable.
To make it more visible, we applied a green background on the editable cells.

{{"demo": "pages/components/data-grid/editing/IsCellEditableGrid.js", "bg": "inline"}}

### Control editing

{{"demo": "pages/components/data-grid/editing/EditRowModelControlGrid.js", "bg": "inline"}}

### Validating new values

To validate cell values on change, you can use the options handler `onEditCellChange`.
{{"demo": "pages/components/data-grid/editing/ValidateRowModelControlGrid.js", "bg": "inline"}}

#### using ApiRef

If you purchase XGrid, then it might be quicker to use `apiRef` to do that.
{{"demo": "pages/components/data-grid/editing/ValidateCellApiRefGrid.js", "bg": "inline"}}

#### Server side validation

#### Save server side with error handling

### Override native behaviour

You can edit on click...
Or with an external button

### Intercept Events

## 🚧 Row editing

> ⚠️ This feature isn't implemented yet. It's coming.
>
> 👍 Upvote [issue #204](https://github.com/mui-org/material-ui-x/issues/204) if you want to see it land faster.

Row editing allows to edit all the cells of a row at once.
The edition can be performed directly in the cells or in a popup or a modal.
