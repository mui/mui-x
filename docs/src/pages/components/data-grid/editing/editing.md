---
title: Data Grid - Editing
---

# Data Grid - Editing

<p class="description">The data grid has built-in edit capabilities that you can customize to your needs.</p>

## Cell editing

Cell editing allows editing the value of one cell at a time.
Set the `editable` property in the `GridColDef` object to `true` to allow editing cells of this column.

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
You can handle the `onEditRowsModelChange` callback to control the `GridEditRowsModel` state.

{{"demo": "pages/components/data-grid/editing/CellEditControlGrid.js", "bg": "inline", "defaultCodeOpen": false}}

### Saving nested structures

If you are using a `valueGetter` to extract the value from a nested object, then a `valueSetter` also needs to be provided.
The first one receives the row object and must return the value to be displayed in the cell.
In the other side, the second one does the inverse, receiving the new value entered and returning the updated row.

The following demo shows how these two functions can be used:

{{"demo": "pages/components/data-grid/editing/ValueGetterSetterGrid.js", "bg": "inline"}}

> Calling the `valueSetter` is the last step in the saving process.
> The [validation](/components/data-grid/editing/#client-side-validation) will still be called with the values before they pass through the setter.

### Client-side validation

To validate the value in the cells, first add a `preProcessEditCellProps` callback to the [column definition](/api/data-grid/grid-col-def/) of the field to validate.
Once it is called, validate the value provided in `params.props.value`.
Then, return a new object contaning `params.props` and also the `error` attribute set to true or false.
If the `error` attribute is true, the value will never be committed.

```tsx
const columns: GridColDef[] = [
  {
    field: 'firstName',
    preProcessEditCellProps: (params: GridEditCellPropsChangeParams) => {
      const hasError = params.props.value.length < 3;
      return { ...params.props, error: hasError };
    },
  },
];
```

Here is an example implementing an email validation:

{{"demo": "pages/components/data-grid/editing/ValidateRowModelControlGrid.js", "bg": "inline"}}

> Alternatively, you can use the `GridEditRowsModel` state mentioned in the [Controlled editing](#controlled-editing) section.
> However, one limitation of this approach is that it does not work with the `singleSelect` column type.

### Server-side validation

Server-side validation works like [client-side validation](#client-side-validation).
The only difference is that when `preProcessEditCellProps` is called, a promise must be returned.
Once the value is validated in the server, that promise should be resolved with a new object containing the `error` attribute set to true or false.
The grid will wait for the promise to be resolved before exiting the edit mode.

This demo shows how you can validate a username asynchronously and prevent the user from committing the value while validating.
It's using `DataGridPro` but the same approach can be used with `DataGrid`.

{{"demo": "pages/components/data-grid/editing/ValidateServerNameGrid.js", "bg": "inline", "defaultCodeOpen": false}}

### Custom edit component

To customize the edit component of a column, use the `renderEditCell` attribute available in the `GridColDef`.

The demo lets you edit the ratings by double-clicking the cell.

{{"demo": "pages/components/data-grid/editing/RenderRatingEditCellGrid.js", "bg": "inline", "defaultCodeOpen": false}}

### Edit using external button [<span class="pro"></span>](https://mui.com/store/items/material-ui-pro/)

You can override the default [start editing](#start-editing) triggers using the [`event.defaultMuiPrevented`](/components/data-grid/events#disabling-the-default-behavior) on the synthetic React events.

{{"demo": "pages/components/data-grid/editing/StartEditButtonGrid.js", "bg": "inline", "disableAd": true}}

### Events [<span class="pro"></span>](https://mui.com/store/items/material-ui-pro/)

The editing feature leverages the event capability of the grid and the apiRef.
The following events can be imported and used to customize the edition:

- `cellEditStart`: emitted when the cell turns to edit mode.
- `cellEditStop`: emitted when the cell turns back to view mode.
- `cellEditCommit`: emitted when the new value is committed.
- `editCellPropsChange`: emitted when the props passed to the edit cell component are changed.

Catching events can be used to add a callback after an event while ignoring its triggers.

The demo shows how to catch the start & end edit events to log which cell is editing in an info message:

{{"demo": "pages/components/data-grid/editing/CatchEditingEventsGrid.js", "bg": "inline", "disableAd": true}}

## Row editing

Row editing allows to edit all the cells of a row at once.
It is based on the [cell editing](/components/data-grid/editing/#cell-editing), thus most of the features are also supported.
To enable it, change the edit mode to `"row"` using the `editMode` prop, then set to `true` the `editable` property in the `GridColDef` object of those columns that should be editable.

```tsx
<DataGrid editMode="row" columns={[{ field: 'name', editable: true }]} />
```

{{"demo": "pages/components/data-grid/editing/BasicRowEditingGrid.js", "bg": "inline", "defaultCodeOpen": false}}

### Start editing

If a cell is editable and has focus, any of the following interactions will start the edit mode of the corresponding row:

- A <kbd class="key">Enter</kbd> keydown
- A double click on the cell
- A call to `apiRef.current.setRowMode(id, 'edit')`.
  ```tsx
  /**
    * Sets the mode of a row.
    * @param {GridRowId} id The id of the row.
    * @param {GridRowMode} mode Can be: `"edit"`, `"view"`.
    */
  setRowMode: (id: GridRowId, mode: GridRowMode) => void;
  ```

### Stop editing

If a row is in edit mode and one of its cells is focused, any of the following interactions will stop the edit mode:

- A <kbd class="key">Escape</kbd> keydown. It will also roll back changes done in the row.
- A <kbd class="key">Enter</kbd> keydown. It will also save and goes to the cell at the next row at the same column.
- A mouse click outside the row
- A call to `apiRef.current.setRowMode(id, 'view')`.

### Controlled editing

The `editRowsModel` prop lets you control the editing state.
You can handle the `onEditRowsModelChange` callback to control the `GridEditRowsModel` state.

{{"demo": "pages/components/data-grid/editing/RowEditControlGrid.js", "bg": "inline", "defaultCodeOpen": false}}

### Conditional validation [<span class="pro"></span>](https://mui.com/store/items/material-ui-pro/)

Having all cells of a row in edit mode allows validating a field based on the value of another one.
To accomplish that, start by adding the `preProcessEditCellProps` as explained in the [cell editing](#client-side-validation).
When the callback is called, use the API to check the value of the other field and decide if the current value is valid or not.
Return a new object contaning `params.props` and the `error` attribute with the validation status.
Once at the least one field has the `error` attribute equals to true no new value will be committed.

**Note:** For server-side validation, the same [approach](#server-side-validation) from the cell editing can be used. The data grid will wait for all promises to resolve before commiting.

The following demo requires a value for the "Payment method" column if the "Is paid?" column was checked.

{{"demo": "pages/components/data-grid/editing/ConditionalValidationGrid.js", "bg": "inline", "defaultCodeOpen": false}}

> The conditional validation can also be implemented with the [controlled editing](#controlled-editing-2).
> This approach can be used in the free version of the DataGrid.
> The only limitation is that it does not work with the `singleSelect` column type.

### Control with external buttons [<span class="pro"></span>](https://mui.com/store/items/material-ui-pro/)

You can [disable the default behavior](/components/data-grid/events/#disabling-the-default-behavior) of the grid and control the row edit using external buttons.

Here is shown how a full-featured CRUD can be created.

{{"demo": "pages/components/data-grid/editing/FullFeaturedCrudGrid.js", "bg": "inline", "disableAd": true}}

### Saving rows with nested structures

Saving columns that make use of `valueGetter` can be done adding a `valueSetter`.
The same [approach](/components/data-grid/editing/#saving-nested-structures) from the cell editing mode can be used here.
Note that the `valueSetter` will be called for each field.

### Events [<span class="pro"></span>](https://mui.com/store/items/material-ui-pro/)

The following events can be imported and used to customize the row edition:

- `rowEditStart`: emitted when the row turns to edit mode.
- `rowEditStop`: emitted when the row turns back to view mode.
- `rowEditCommit`: emitted when the new row values are committed.
- `editCellPropsChange`: emitted when the props passed to an edit cell component are changed.

## apiRef [<span class="pro"></span>](https://mui.com/store/items/material-ui-pro/)

{{"demo": "pages/components/data-grid/editing/EditApiNoSnap.js", "bg": "inline", "hideToolbar": true}}

## API

- [DataGrid](/api/data-grid/data-grid/)
- [DataGridPro](/api/data-grid/data-grid-pro/)
