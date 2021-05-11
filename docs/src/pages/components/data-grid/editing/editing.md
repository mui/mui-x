---
title: Data Grid - Editing
components: DataGrid, XGrid
---

# Data Grid - Editing

<p class="description">The data grid has built-in edit capabilities that you can customize to your needs.</p>

## Cell editing

Cell editing allows editing the value of one cell at a time.
Set the `editable` property of the column definition `GridColDef` object to `true` to allow editing cells of this column.

```tsx
<DataGrid columns={[{ field: 'name', editable: true }]} />
```

{{"demo": "pages/components/data-grid/editing/BasicEditingGrid.js", "bg": "inline", "defaultCodeOpen": false}}

### Start editing

If a cell is editable and has focus, any of the following interactions will start the edit mode:

- A <kbd class="key">Enter</kbd> keydown
- A <kbd class="key">Backspace</kbd> or <kbd class="key">Delete</kbd> keydown. It will also delete the value and stops the edit mode instantly.
- A keydown of any printable key, for instance `a`, `E`, `0`, or `$`
- A double click on the cell
- A call to `apiRef.current.setCellMode(id, field, 'edit')`.
  ```tsx
  /**
    * Set the cellMode of a cell.
    * @param GridRowId
    * @param string
    * @param 'edit' | 'view'
    */
  setCellMode: (id: GridRowId, field: string, mode: GridCellMode) => void;
  ```

### Stop editing

If a cell is in edit mode and has focus, any of the following interactions will stop the edit mode:

- A <kbd class="key">Escape</kbd> keydown. It will also roll back changes done in the value of the cell.
- A <kbd class="key">Tab</kbd> keydown. It will also save and goes to the next cell on the same row.
- A <kbd class="key">Enter</kbd> keydown. It will also save and goes to the next cell on the same column.
- A mousedown outside the cell
- A call to `apiRef.current.setCellMode(id, field, 'view')`.

### Control cell editability

In addition to the `editable` flag on columns, control which cell is editable using the `isCellEditable` prop.

In this demo, only the rows with an even `Age` value are editable.
The editable cells have a green background for better visibility.

{{"demo": "pages/components/data-grid/editing/IsCellEditableGrid.js", "bg": "inline"}}

### Controlled editing

The `editRowsModel` prop lets you control the editing state.
You can handle the `onEditRowModelChange` callback to control the `GridEditRowsModel` state.

{{"demo": "pages/components/data-grid/editing/EditRowModelControlGrid.js", "bg": "inline", "defaultCodeOpen": false}}

### Column with valueGetter

You can control the committed value when the edit move stops with the `onEditCellChangeCommitted` prop.
This is especially interesting when using the `valueGetter` on the column definition.

{{"demo": "pages/components/data-grid/editing/ValueGetterGrid.js", "bg": "inline"}}

### Client-side validation

Follow the following steps to validate the value in the cells:

- Set the event handler `onEditCellChange`. It's invoked when a change is triggered by the edit input component.
- Set the event handler `onEditCellChangeCommitted` to validate or persist the new value. This handler is invoked when an end-user requests a change to be committed and before the cell reverts to view mode.

Alternatively, you can use the `GridEditRowsModel` state mentioned in the [Control editing](#control-editing) section.

{{"demo": "pages/components/data-grid/editing/ValidateRowModelControlGrid.js", "bg": "inline"}}

#### Using apiRef [<span class="pro"></span>](https://material-ui.com/store/items/material-ui-pro/)

You can reproduce the same behavior using the apiRef.

{{"demo": "pages/components/data-grid/editing/ValidateCellApiRefGrid.js", "bg": "inline", "disableAd": true}}

### Server-side validation

Server-side validation works like client-side [validation](#validation).

- Use the `GridEditRowsModel` mentioned in the [Control editing](#control-editing) section.
- Or set the event handler `onEditCellChange` for `keydown` validation
- Set the event handler `onEditCellChangeCommitted` to validate and update the server when the change is committed.

**Note:** To prevent the default client-side behavior, use `event.stopPropagation()`.

This demo shows how you can validate a username asynchronously and prevent the user from committing the value while validating.
It's using `XGrid` but the same approach can be used with `DataGrid`.

{{"demo": "pages/components/data-grid/editing/ValidateServerNameGrid.js", "bg": "inline", "defaultCodeOpen": false}}

### Custom edit component

To customize the edit component of a column, set the `renderEditCell` function available in the column definition `GridColDef`.

The demo lets you edit the ratings by double-clicking the cell.

{{"demo": "pages/components/data-grid/editing/RenderRatingEditCellGrid.js", "bg": "inline", "defaultCodeOpen": false}}

### Edit using external button [<span class="pro"></span>](https://material-ui.com/store/items/material-ui-pro/)

You can override the default [start editing](#start-editing) triggers using the `event.stopPropagation()` API on the synthetic React events.

{{"demo": "pages/components/data-grid/editing/StartEditButtonGrid.js", "bg": "inline", "disableAd": true}}

### Events [<span class="pro"></span>](https://material-ui.com/store/items/material-ui-pro/)

The editing feature leverages the event capability of the grid and the apiRef.
The following events can be imported and used to customize the edition:

- `GRID_CELL_EDIT_ENTER`: emitted when the cell turns to edit mode.
- `GRID_CELL_EDIT_EXIT`: emitted when the cell turns back to view mode.
- `GRID_CELL_EDIT_PROPS_CHANGE`: emitted when the edit input change.
- `GRID_CELL_EDIT_PROPS_CHANGE_COMMITTED`: emitted when the edit input change is submitted.

Catching events can be used to add a callback after an event while ignoring its triggers.

The demo shows how to catch the start & end edit events to log which cell is editing in an info message:

{{"demo": "pages/components/data-grid/editing/CatchEditingEventsGrid.js", "bg": "inline", "disableAd": true}}

## 🚧 Row editing

> ⚠️ This feature isn't implemented yet. It's coming.
>
> 👍 Upvote [issue #204](https://github.com/mui-org/material-ui-x/issues/204) if you want to see it land faster.

Row editing allows to edit all the cells of a row at once.
The edition can be performed directly in the cells or in a popup or a modal.
