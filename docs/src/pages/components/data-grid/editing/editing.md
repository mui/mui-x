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

The `editRowsModel` lets you control the editing. 

{{"demo": "pages/components/data-grid/editing/EditRowModelControlGrid.js", "bg": "inline", "defaultCodeOpen": false}}

#### value Getter

If the column definition process their data using a `valueGetter`,
then you will need to set the underlying data. You can do this by implementing `onEditCellChangeCommitted` event handler.
This handler is called when the edit value is submitted, and the grid is about to update its cell value.

{{"demo": "pages/components/data-grid/editing/ValueGetterGrid.js", "bg": "inline"}}

### Validation

To validate cell values on input change, you can use the options handler `onEditCellChange`.
{{"demo": "pages/components/data-grid/editing/ValidateRowModelControlGrid.js", "bg": "inline"}}

#### using ApiRef

If you purchase XGrid, then it might be quicker to use `apiRef` to do that.
{{"demo": "pages/components/data-grid/editing/ValidateCellApiRefGrid.js", "bg": "inline"}}

### Server side

You can implement server side validation by implementing an handler on `onEditCellChange` for `keydown` validation. 

Or You can validate or apply changes on the server when a value is committed. To achieve this, you would need to implement `onEditCellChangeCommitted`. 

**Note:** To prevent the default client side behavior, you can use `event.stopPropagation()`.

The example below shows how you can validate a username asynchronously and prevent the user from committing the value while validating.
{{"demo": "pages/components/data-grid/editing/ValidateServerNameGrid.js", "bg": "inline", "defaultCodeOpen": false}}

### Customization

#### Component

You can customize the edit component of a column using the `renderEditCell` function available as a prop of the column definition `GridColDef`.
The demo below lets you edit the ratings by double clicking the cell.
{{"demo": "pages/components/data-grid/editing/RenderRatingEditCellGrid.js", "bg": "inline", "defaultCodeOpen": false}}

#### Start Edit using external button

By default, the grid cell turns in edit mode using the keyboard by double clicking on it.
You can customize that behaviour and override it completely as shown in the demo below.

{{"demo": "pages/components/data-grid/editing/StartEditButtonGrid.js", "bg": "inline"}}

### Events

The editing feature leverages the event capability of the grid and the apiRef.
The following events can be used to customize the edition:

- `cellEditEnter`: emitted when the cell turns to edit mode.
- `cellEditExit`: emitted when the cell turns back to view mode.
- `cellEditPropsChange`: emitted when the edit input change.
- `cellEditPropsChangeCommitted`: emitted when the edit input change is submitted.

You can catch the events while ignoring the trigger of the event.

The demo below shows how you can catch the start/end edit events which can be triggered using a mouse or a keyboard interaction.

{{"demo": "pages/components/data-grid/editing/CatchEditingEventsGrid.js", "bg": "inline"}}


## 🚧 Row editing

> ⚠️ This feature isn't implemented yet. It's coming.
>
> 👍 Upvote [issue #204](https://github.com/mui-org/material-ui-x/issues/204) if you want to see it land faster.

Row editing allows to edit all the cells of a row at once.
The edition can be performed directly in the cells or in a popup or a modal.
