---
title: Data Grid - Editing (legacy)
---

# Data Grid - Editing (legacy)

<p class="description">The data grid has built-in edit capabilities that you can customize to your needs.</p>

## Cell editing

To enable cell editing within a column, set the `editable` property in the `GridColDef` object to `true` to allow editing cells of this column.

```tsx
<DataGrid columns={[{ field: 'name', editable: true }]} />
```

{{"demo": "BasicEditingGrid.js", "bg": "inline", "defaultCodeOpen": false}}

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

In addition to the `editable` flag on columns, you can enable or disable editing of individual cells using the `isCellEditable` prop.

In this demo, only the rows with an even `Age` value are editable.
The editable cells have a green background for better visibility.

{{"demo": "IsCellEditableGrid.js", "bg": "inline"}}

### Controlled editing

The `editRowsModel` prop lets you control the editing state.
You can use the `onEditRowsModelChange` callback to control the `GridEditRowsModel` state.

{{"demo": "CellEditControlGrid.js", "bg": "inline", "defaultCodeOpen": false}}

### Saving nested structures

If you are using a `valueGetter` to extract the value from a nested object, then you must also provides a `valueSetter`.
The `valueGetter` receives the row object and must return the value to be displayed in the cell.
The `valueSetter`, in turn, receives the new value and returns the updated row.

The following demo shows how these two functions can be used:

{{"demo": "ValueGetterSetterGrid.js", "bg": "inline"}}

> Calling the `valueSetter` is the last step in the saving process.
> The [validation](/x/react-data-grid/editing/#client-side-validation) will still be called with the values before they pass through the setter.

### Client-side validation

To validate the value of a cell, add the `preProcessEditCellProps` callback to the [column definition](/x/api/data-grid/grid-col-def/) of the field you wish to validate.
Once it is called, you can validate the value provided in `params.props.value`.
Then, return a new object containing `params.props` along with `error` attribute set to true or false.
If the `error` attribute is true, the value will never be committed.

```tsx
const columns: GridColDef[] = [
  {
    field: 'firstName',
    preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
      const hasError = params.props.value.length < 3;
      return { ...params.props, error: hasError };
    },
  },
];
```

Here is an example implementing an email validation:

{{"demo": "ValidateRowModelControlGrid.js", "bg": "inline"}}

> Alternatively, you can use the `GridEditRowsModel` state mentioned in the [Controlled editing](#controlled-editing) section.
> However, one limitation of this approach is that it does not work with the `singleSelect` column type.

### Server-side validation

Server-side validation works like [client-side validation](#client-side-validation).
The only difference is that when you call `preProcessEditCellProps`, you must return a promise.
Once the value is validated in the server, the promise should be resolved with a new object containing the `error` attribute set to true or false.
The grid will wait for the promise to be resolved before exiting the edit mode.

<!-- TODO v6: make the following paragraph the default behavior -->

> By default, `preProcessEditCellProps` is called on each value change and during commit.
> With column types that automatically commit the value after a selection (e.g. `singleSelect`) this means that the callback will be called twice and with the wrong value in the second call.
> To avoid this inconsistency, enable the `preventCommitWhileValidating` flag available in the experimental features.
>
> ```jsx
> <DataGrid experimentalFeatures={{ preventCommitWhileValidating: true }} />
> ```
>
> It's labeled as experimental because in v6 this flag will become the default behavior.

This demo shows how you can validate a username asynchronously and prevent the user from committing the value while validating.
It's using `DataGridPro` but the same approach can be used with `DataGrid`.

{{"demo": "ValidateServerNameGrid.js", "bg": "inline", "defaultCodeOpen": false}}

### Server-side persistence

If you want to send the updated data to your server, you can use the `onCellEditCommit` which is fired just before committing the new cell value to the grid.

You can then decide if you want to send the whole row or only the modified fields.

{{"demo": "CellEditServerSidePersistence.js", "bg": "inline", "defaultCodeOpen": false}}

### Custom edit component

To customize the edit component of a column, use the `renderEditCell` attribute available in the `GridColDef`.

The demo lets you edit the ratings by double-clicking the cell.

{{"demo": "RenderRatingEditCellGrid.js", "bg": "inline", "defaultCodeOpen": false}}

### Edit using external button [<span class="plan-pro"></span>](https://mui.com/store/items/mui-x-pro/)

You can override the default [start editing](#start-editing) triggers using the [`event.defaultMuiPrevented`](/x/react-data-grid/events/#disabling-the-default-behavior) on the synthetic React events.

{{"demo": "StartEditButtonGrid.js", "bg": "inline", "disableAd": true}}

### Events [<span class="plan-pro"></span>](https://mui.com/store/items/mui-x-pro/)

The editing feature leverages the event capability of the grid and the apiRef.
You can import the following events to customize the editing experience:

- `cellEditStart`: triggered when a cell enters edit mode.
- `cellEditStop`: triggered when a cell returns to view mode.
- `cellEditCommit`: triggered when a new value is committed.
- `editCellPropsChange`: triggered when a props passed to the edit cell component are changed.

You can use event catching to add a callback after an event while ignoring its triggers.

The demo shows how to catch the start and end edit events in order to log which cell has been edited in an info message:

{{"demo": "CatchEditingEventsGrid.js", "bg": "inline", "disableAd": true}}

## Row editing

Row editing lets you edit all cells in a given row simultaneously.
It supports most of the same features as those available for [cell editing](/x/react-data-grid/editing/#cell-editing).
To enable it, change the edit mode to `"row"` using the `editMode` prop, then set to `true` the `editable` property in the `GridColDef` object of those columns that should be editable.

```tsx
<DataGrid editMode="row" columns={[{ field: 'name', editable: true }]} />
```

{{"demo": "BasicRowEditingGrid.js", "bg": "inline", "defaultCodeOpen": false}}

### Start editing

You can start editing a cell using any of the following interactions:

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

You can stop editing a cell using any of the following interactions:

- A <kbd class="key">Escape</kbd> keydown. This will also roll back any changes made to the row.
- A <kbd class="key">Enter</kbd> keydown. This will also save the value and move the focus to the cell in the next row of the same column.
- A mouse click outside the row
- A call to `apiRef.current.setRowMode(id, 'view')`.

### Controlled editing

The `editRowsModel` prop lets you control the editing state.
You can handle the `onEditRowsModelChange` callback to control the `GridEditRowsModel` state.

{{"demo": "RowEditControlGrid.js", "bg": "inline", "defaultCodeOpen": false}}

### Conditional validation [<span class="plan-pro"></span>](https://mui.com/store/items/mui-x-pro/)

Having all cells of a row in edit mode allows validating a field based on the value of another one
To do this, you will first need to add a `preProcessEditCellProps` callback to the [column definition](/x/api/data-grid/grid-col-def/).
When all cells in a row are in edit mode, you can validate fields by comparing their values.
Return a new object contaning `params.props` and the `error` attribute with the validation status.
Once at the least one field has the `error` attribute equals to true no new value will be committed.

:::warning
Server-side validation works like [client-side validation](#client-side-validation).
The only difference is that when you call `preProcessEditCellProps`, you must return a promise.
Once the value is validated in the server, the promise should be resolved with a new object containing the `error` attribute set to true or false.
The grid will wait for the promise to be resolved before exiting the edit mode.
:::

The following demo requires a value for the **Payment method** column if the **Is paid?** column is checked.

{{"demo": "ConditionalValidationGrid.js", "disableAd": true, "bg": "inline", "defaultCodeOpen": false}}

> The conditional validation can also be implemented with the [controlled editing](#controlled-editing-2).
> This approach can be used in the free version of the DataGrid.
> The only limitation is that it does not work with the `singleSelect` column type.

### Control with external buttons [<span class="plan-pro"></span>](https://mui.com/store/items/mui-x-pro/)

You can [disable the default behavior](/x/react-data-grid/events/#disabling-the-default-behavior) of the grid and control the row edit using external buttons.

Here is how you can create a full-featured CRUD:

{{"demo": "FullFeaturedCrudGrid.js", "bg": "inline", "disableAd": true}}

### Saving rows with nested structures

You can save columns that make use of `valueGetter` by adding a `valueSetter`.
The same [approach](/x/react-data-grid/editing/#saving-nested-structures) from the cell editing mode can be used here.
Note that the `valueSetter` will be called for each field.

### Server-side persistence [<span class="plan-pro"></span>](https://mui.com/store/items/mui-x-pro/)

If you want to send the updated data to your server, you can use `onRowEditCommit` which is fired just before committing the new cell value to the grid.

To access the new values for the row, use `apiRef.current.getEditRowsModel` to enable edit mode on all rows, then use the ID provided to get only the values for the row that was committed.

You can then decide if you want to send the whole row or only the modified fields by checking them against the previous row values.

{{"demo": "RowEditServerSidePersistence.js", "disableAd": true, "bg": "inline", "defaultCodeOpen": false}}

### Events [<span class="plan-pro"></span>](https://mui.com/store/items/mui-x-pro/)

You can import the following events to customize the editing experience:

- `rowEditStart`: triggered when a row enters edit mode.
- `rowEditStop`: triggered when a row returns to view mode.
- `rowEditCommit`: triggered when new row values are committed.
- `editCellPropsChange`: triggered when the props passed to the edit cell component are changed.

## apiRef [<span class="plan-pro"></span>](https://mui.com/store/items/mui-x-pro/)

:::warning
Only use this API as the last option. Give preference to the props to control the grid.
:::

{{"demo": "EditApiNoSnap.js", "bg": "inline", "hideToolbar": true}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
