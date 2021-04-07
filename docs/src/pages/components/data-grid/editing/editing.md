---
title: Data Grid - Editing
components: DataGrid, XGrid
---

# Data Grid - Editing

<p class="description">The data grid has built-in edit capabilities that you can customize to your needs.</p>

## Cell editing

Cell editing allows to edit the value of one cell at a time. 
- set `editable` attribute of the column definition `GridColDef` object to `true` to allow editing cells of this column.

```tsx
<DataGrid columns={[{ field: 'name', editable: true }]} />
```

### Start Editing

If a column is editable and if a cell has focus.

- Press <kbd class="key">Enter</kbd> to switch to edit mode
- Press <kbd class="key">Delete</kbd> to delete the value 
- Type any alpha key to start editing
- Double click to switch to edit mode

{{"demo": "pages/components/data-grid/editing/BasicEditingGrid.js", "bg": "inline", "defaultCodeOpen": false}}

### Stop Editing

- <kbd class="key">Escape</kbd> to rollback changes.
- <kbd class="key">Tab</kbd> to save and goes to next cell.
- <kbd class="key">Enter</kbd> to save and goes to next cell below.
- Click outside the cell

### Control cell editability

In addition to the `editable` flag on columns, control which cell is editable using `isCellEditable` prop.

*In this demo, `Name` is not editable, and only the rows with an even `Age` value are editable.
We applied a green background for a better visibility.*

{{"demo": "pages/components/data-grid/editing/IsCellEditableGrid.js", "bg": "inline"}}

### Control editing

The `editRowsModel` lets you control the editing. 
- implement the `onEditRowModelChange` to control the state of the `GridEditRowsModel` model.

{{"demo": "pages/components/data-grid/editing/EditRowModelControlGrid.js", "bg": "inline", "defaultCodeOpen": false}}

#### value Getter

If the column definition process their data using a `valueGetter`.
- set the underlying data by implementing `onEditCellChangeCommitted` event handler invoked when the change is submitted, and the grid is about to update.

{{"demo": "pages/components/data-grid/editing/ValueGetterGrid.js", "bg": "inline"}}

### Validation

To validate cell values on input change.
- set the event handler `onEditCellChange` invoked when a change is triggered by the edit input component.
- or use the `GridEditRowsModel` mentioned in [Control Editing](#control-editing).

To validate, and update the server when the change is committed.
- set the event handler `onEditCellChangeCommitted`.

{{"demo": "pages/components/data-grid/editing/ValidateRowModelControlGrid.js", "bg": "inline"}}

#### using ApiRef

If you purchased XGrid, it will be quicker to use `apiRef` to do that.
{{"demo": "pages/components/data-grid/editing/ValidateCellApiRefGrid.js", "bg": "inline"}}

### Server side

Server side validation works just like client side [validation](#validation).
- use the `GridEditRowsModel` mentioned in [Control Editing](#control-editing).
- or set the event handler `onEditCellChange` for `keydown` validation

To validate, and update the server when the change is committed.
- set the event handler `onEditCellChangeCommitted`.

**Note:** To prevent the default client side behavior, use `event.stopPropagation()`.

*This demo shows how you can validate a username asynchronously and prevent the user from committing the value while validating.*
{{"demo": "pages/components/data-grid/editing/ValidateServerNameGrid.js", "bg": "inline", "defaultCodeOpen": false}}

### Customization

#### Component

To customize the edit component of a column 
- set the `renderEditCell` function available in the column definition `GridColDef`.

*The demo lets you edit the ratings by double clicking the cell.*
{{"demo": "pages/components/data-grid/editing/RenderRatingEditCellGrid.js", "bg": "inline", "defaultCodeOpen": false}}

#### Edit using external button

By default, cells turn to edit mode using the keyboard or by double clicking on it.
- Customize that behaviour and override it completely as shown in this demo.

{{"demo": "pages/components/data-grid/editing/StartEditButtonGrid.js", "bg": "inline"}}

### Events

The editing feature leverages the event capability of the grid and the apiRef.
The following events can be used to customize the edition:

- `cellEditEnter`: emitted when the cell turns to edit mode.
- `cellEditExit`: emitted when the cell turns back to view mode.
- `cellEditPropsChange`: emitted when the edit input change.
- `cellEditPropsChangeCommitted`: emitted when the edit input change is submitted.

Catching events can be used to add a callback after an event while ignoring its triggers.

*The demo shows how to catch the start & end edit events which can be triggered using a mouse or a keyboard interaction.*

{{"demo": "pages/components/data-grid/editing/CatchEditingEventsGrid.js", "bg": "inline"}}

## 🚧 Row editing

> ⚠️ This feature isn't implemented yet. It's coming.
>
> 👍 Upvote [issue #204](https://github.com/mui-org/material-ui-x/issues/204) if you want to see it land faster.

Row editing allows to edit all the cells of a row at once.
The edition can be performed directly in the cells or in a popup or a modal.
