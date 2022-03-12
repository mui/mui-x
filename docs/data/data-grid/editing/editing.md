---
title: Data Grid - Editing
---

# Data Grid - Editing

<p class="description">The data grid has built-in support for cell and row editing.</p>

> ⚠️ This page refers to the new editing API, not enabled by default.
> To use it, enable the following flag:
>
> ```tsx
> <DataGrid experimentalFeatures={{ newEditingApi: true }} />
> ```
>
> This additional step is required because the default editing API has a couple of issues which can only be fixed with breaking changes, only possible in v6.
> To avoid having to wait for the next major release window, all breaking changes needed were included inside this flag.
>
> If you are looking for the documentation for the default editing API, visit [this page](/components/data-grid/editing-legacy/).
> Note that it is encouraged to migrate to the new editing API since it will be enabled by default in v6.
> Although it says "experimental", you can consider it as stable.

## Making a column editable

You can make a column editable by enabling the `editable` property in its [column definition](/api/data-grid/grid-col-def/):

```tsx
<DataGrid columns={[{ field: 'name', editable: true }]} />
```

This will allow to edit any cell from the specified column.
By default, the cell editing mode is assumed, meaning that only a single cell can have its mode equals to `"edit"` each time.
To edit simultaneously all cells of a row, you can use the row editing mode, accessible by setting the `editMode` prop to `"row"`.
For more information, see the dedicated [section](#row-editing).

The following demo shows an example of how to make all columns editable.
Play with it by double-clicking or pressing <kbd class="key">Enter</kbd> in any cell from this column.

{{"demo": "BasicEditingGrid.js", "bg": "inline", "defaultCodeOpen": false}}

### Start editing

There are a few ways to start editing a cell (or a row if `editMode="row"`):

- Double-clicking a cell.
- Pressing <kbd class="key">Enter</kbd>, <kbd class="key">Backspace</kbd> or <kbd class="key">Delete</kbd>.
  Note that when you press the <kbd class="key">Backspace</kbd> or <kbd class="key">Delete</kbd> key, any existing content in the cell will be deleted.
- Pressing any printable key, for instance `a`, `E`, `0`, or `$`.
- Calling `apiRef.current.startCellEditMode` passing the row ID and column field of the cell to edit.

  ```tsx
  apiRef.current.startCellEditMode({ id: 1, field: 'name' });
  ```

- Calling `apiRef.current.startRowEditMode` passing the ID of the row (only available if `editMode="row"`).

  ```tsx
  apiRef.current.startRowEditMode({ id: 1 });
  ```

### Stop editing

Once a cell is in edit mode, any of the following interactions will stop the edit mode and, depending on the action, save or revert the changes made:

- Pressing <kbd class="key">Escape</kbd> stops the edit mode and reverts the changes.
- Pressing <kbd class="key">Tab</kbd> or <kbd class="key">Enter</kbd> saves the changes and stops the edit mode.
  In the case of <kbd class="key">Enter</kbd> it will also move the focus to the cell immediatelly below the current one.
- Clicking outside the cell (or row) being edited saves the new value and stops the edit mode.
- Calling `apiRef.current.stopCellEditMode({ id, field })` passing the row ID and column field of the cell to edit.

  ```tsx
  apiRef.current.stopCellEditMode({ id: 1, field: 'name' });

  // or

  apiRef.current.stopCellEditMode({
    id: 1,
    field: 'name',
    ignoreModifications: true, // will also discard the changes made
  });
  ```

- Calling `apiRef.current.stopRowEditMode` passing the ID of the row (only available if `editMode="row"`).

  ```tsx
  apiRef.current.stopRowEditMode({ id: 1 });

  // or

  apiRef.current.stopRowEditMode({
    id: 1,
    ignoreModifications: true, // will also discard the changes made
  });
  ```

### Disable editing in specific cells within a row

The `editable` property controls which cells are editable at the column level.
To give flexibility, the `isCellEditable` callback prop allows to define which cells are editable in each row.
It is called with a [`GridCellParams`](/api/data-grid/grid-cell-params/) object and must return `true` if the cell is editable, or `false` if not.

In the following demo, only the rows with an even `Age` value are editable.
The editable cells have a green background for better visibility.

{{"demo": "IsCellEditableGrid.js", "bg": "inline"}}

## Value parser and value setter

A value parser allows to modify the value entered by the user.
It can be used, for instance, to convert the value sent by the edit component to a different format.
To do so, use the `valueParser` property of the column definition:

```tsx
const columns: GridColDef[] = [
  {
    valueParser: (value: GridCellValue, params: GridCellParams) => {
      return value.toLowerCase();
    },
  },
];
```

On the other hand, a value setter customizes how the row is updated with the new value.
If you are already using a `valueGetter` to extract the value from a nested object, then the `valueSetter` will do the inverse task.
To do so, use the `valueSetter` property of the column definition.
It will be called with an object containing the new value to be saved and the row where this value belongs to.

```tsx
const columns: GridColDef[] = [
  {
    valueSetter: (params: GridValueSetterParams) => {
      const [firstName, lastName] = params.value!.toString().split(' ');
      return { ...params.row, firstName, lastName };
    },
  },
];
```

In the following demo, both value parser and value setter were defined for the "Full name" column.
The value parser converts the value entered to uppercase while the value setter splits the value and saves it correctly into the row model:

{{"demo": "ValueParserSetterGrid.js", "bg": "inline", "defaultCodeOpen": false}}

## Events

The mouse and keyboard interactions that [start](#start-editing) and [stop](#stop-editing) the cell editing will fire, respectively, the [events](/components/data-grid/events/) `'cellEditStart'` and `'cellEditStop'`.
For row editing, the events are `'rowEditStart'` and `'rowEditStop'`.
You can control how these events are handled and customize the behavior of the cell editing or row editing.

For convenience, you can also listen to these events using their equivalent props:

- `onCellEditStart`
- `onCellEditStop`
- `onRowEditStart`
- `onRowEditStop`

These events and props are called with an object containing the row ID and column field of the cell that is being edited.
Also, the object contains a `reason` param specifying which type of interaction caused the event to be fired (e.g. `'cellDoubleClick'` for when a double-click starts the edit mode).

The following demo prevents stoping the edit mode of a cell when that same cell loses focus by a click outside it.
To accomplish this task, the `onCellEditStop` prop was used to check if the `reason` is `'cellFocusOut'`.
If that condition is true, it [disables](/components/data-grid/events/#disabling-the-default-behavior) the default event behavior.
The only ways to stop editing a cell now is to press <kbd class="key">Enter</kbd>, <kbd class="key">Escape</kbd> or <kbd class="key">Tab</kbd>.

{{"demo": "DisableStopEditModeOnFocusOut.js", "bg": "inline"}}

### Disabling default start and stop behavior

The following demo shows how external buttons can be used to start and stop the edit mode.
For this, the default behavior of the `onCellEditXXX` events was disabled.
To edit a cell, first click it, then click in the Edit button.

{{"demo": "StartEditButtonGrid.js", "bg": "inline", "defaultCodeOpen": false}}

## Validation

If the column definition sets a callback for the `preProcessEditCellProps` property, then it will be called each time a new value is entered into a cell from this column.
The general purpose of this property is to allow to pre-process the props that are passed to the edit component.
The `preProcessEditCellProps` callback will be called with an object contaning the following attributes:

- `id`: the row ID
- `row`: the row model with values before the cell or row entered the edit mode
- `props`: the props, containing the value after the value parser, that will be passed to the edit component
- `hasChanged`: determines if `props.value` is different from the last time this callback was called

One type of pre-processing that can be done with it is data validation.
To validate the data entered, pass a callback to `preProcessEditCellProps` checking if `props.value` is valid.
If the new value is invalid, set `props.error` to a truthy value and return the modified props, as shown in the example below.
When the user tries to save the changed value, if the error attribute is truthy (invalid) the value will not be saved.

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

> ⚠ Changing `props.value` inside the callback has no effect. To pre-process it, use a [value parser](#value-parser-and-value-setter).

The demo below contains an example of server-side data validation.
The only difference, in comparison to the steps above, is that the callback returns a promise which resolves to the modified props.
Note that the value passed to `props.error` is passed directly to the edit component as the `error` prop.
While the promise is not resolved, the edit component will receive an `isProcessingProps` prop with value equal to `true`.

{{"demo": "ValidateServerNameGrid.js", "bg": "inline", "defaultCodeOpen": false}}

> ⚠ If an interaction that saves and stops editing (e.g. pressing <kbd class="key">Enter</kbd>) occurs while processing the props, the changes made are discarded and the cell will immediatelly exit the edit mode.
> To avoid losing the changes, it is import to provide some feedback to users about the ongoing processing.
> You can use the `isProcessingProps` prop to show a loader while waiting for the server to respond.

## Persistence

After executing one of the [stop editing](#stop-editing) interactions, the `processRowUpdate` prop will be called.
Use this prop to send the new values to the server and save it into a database or other storage method.
The prop is called with two arguments: the first being the updated row with the new values, and after passing through the value setter, and the second is the row before the current cell or row has entered the edit mode (a.k.a the original row).
Once the row was saved, `processRowUpdate` must return the row object that will be used to update the internal state.
This value returned is used as argument to a call to `apiRef.current.updateRows`.

If while calling `processRowUpdate` you need to cancel the save process, like when a database validation fails or the user wants to reject the changes, there are two options:

- Reject the promise to not update the internal state and keep the cell in edit mode.
- Resolve the promise with the second argument (the original row) received to make it stop silently, not updating the internal state but exiting the edit mode.

The next demo implements the first option.
Instead of [validating](#validation) while typing, it validates in the server.
If the new name is empty it will not allow to save and the cell is kept into edit mode.
Also, it shows that `processRowUpdate` can be used to pre-process the row model that will be saved into the internal state.
To leave the edit mode, press <kbd class="key">Escape</kbd> or enter a valid name.

{{"demo": "ServerSidePersistence.js", "bg": "inline", "defaultCodeOpen": false}}

### Ask confirmation before save

The second option to cancel the save process allows the user to reject the changes and return immediatelly to the view mode.
This is acomplished by resolving `processRowUpdate` with the second argument.

The following demo shows how this approach can be leveraged to ask a confirmation before sending the data to the server.
In case the user accepts the change, the internal state is updated with the values.
However, if the changes are rejected, no state is changed and the cell is reverted to its original value.
The demo also employs validation to prevent entering an empty name.

{{"demo": "AskConfirmationBeforeSave.js", "bg": "inline", "defaultCodeOpen": false}}

## Create your own edit component

Each of the built-in column types provide a component to edit the value of the cells.
For custom column types or to override the existing components, you can provide a new edit component through the `renderEditCell` property in the column definition.
This property works like the `renderCell` property, which is rendered while cells are in view mode.

```tsx
function CustomEditComponent(props: GridRenderEditCellParams) {
  return <input type="text" value={params.value} onChange={...}>;
}

const columns: GridColDef[] = [
  {
    field: 'firstName',
    renderEditCell: (params: GridRenderEditCellParams) => (
      return <CustomEditComponent {...params} />;
    ),
  },
];
```

The `renderEditCell` property receives all params from `GridRenderEditCellParams`, which extends `GridCellParams`.
Additionally, the props added during [pre-processing](#validation) are also available in the params.
From all params, the following one are the most important:

- `value`: contains the current value of the cell in edit mode, overriding the value from `GridCellParams`
- `error`: the error added during validation
- `isProcessingProps`: whether `preProcessEditCellProps` is being executed or not

Once a new value is entered into the input, it must be sent to the grid.
For this task, pass the row ID, the column field and the new cell value to a call to `apiRef.current.setEditCellValue`.
The new value will be parsed and validated and the `value` prop will reflect it in the next render.

```tsx
function CustomEditComponent(props: GridRenderEditCellParams) {
  const { id, value, field } = props;
  const apiRef = useGridApiContext();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value; // The new value entered by the user
    apiRef.current.setEditCellValue({ id, field, value: newValue });
  };

  return <input type="text" value={value} onChange={handleChange}>;
}
```

The demo below implements a custom edit component, based on [Rating](https://mui.com/components/rating) from `@mui/material`, for the Rating column.

{{"demo": "CustomEditComponent.js", "bg": "inline", "defaultCodeOpen": false}}

### With debounce

By default, each call to `apiRef.current.setEditCellValue` triggers a new render.
If the edit component requires the user to type a new value, re-rendering the grid too often will drastically reduce performance.
One way to avoid that is to debounce the API calls.
To help with that, `apiRef.current.setEditCellValue` handles debouncing out-of-box by setting the `debounceMs` param to a positive integer.
Once a value, corresponding to the number of milliseconds, is given no matter how many times the API method is called a new render will only occurs after the specifid amount of time has passed.

```tsx
apiRef.current.setEditCellValue({ id, field, value: newValue, debounceMs: 200 });
```

Since now a new render only occurs after some time has passed, the `value` prop will not be updated on each `apiRef.current.setEditCellValue` call.
To avoid frozen UIs, the edit component can keep the current value in an internal state and sync it once `value` changes.
To do that apply the following modifications to your edit compoment.

```diff
 function CustomEditComponent(props: GridRenderEditCellParams) {
-  const { id, value, field } = props;
+  const { id, value: valueProp, field } = props;
+  const [value, setValue] = React.useState(valueProp);
   const apiRef = useGridApiContext();

   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
     const newValue = event.target.value; // The new value entered by the user
-    apiRef.current.setEditCellValue({ id, field, value: newValue });
+    apiRef.current.setEditCellValue({ id, field, value: newValue, debounceMs: 200 });
+    setValue(newValue);
   };

+  React.useEffect(() => {
+    setValue(valueProp);
+  }, [valueProp]);
+
   return <input type="text" value={value} onChange={handleChange}>;
}
```

### With auto-stop

An edit component has an "auto-stop" behavior when it stops the edit mode as soon as the value is changed.
To picture better, imagine an edit component with a combo, created following the steps above.
By default, it would require two clicks to change the value of the cell: one click to select a new value and another click outside to save.
This second click can be avoided if the first click also stops the edit mode.
To create an edit component with auto-stop, call `apiRef.current.stopCellEditMode` after setting the new value.
Since `apiRef.current.setEditCellValue` may do additional processing, it is necessary to first wait for it to resolve before stopping the edit mode.
Also, it is a good practice to check if `apiRef.current.setEditCellValue` returned `true`.
It will be `false` if `preProcessEditProps` set an error during [validation](#validation).

```tsx
const handleChange = async (event: SelectChangeEvent) => {
  const isValid = await apiRef.current.setEditCellValue({
    id,
    field,
    value: event.target.value,
  });

  if (isValid) {
    apiRef.current.stopCellEditMode({ id, field });
  }
};
```

The demo below implements an edit component with auto-stop, based on a native [Select](https://mui.com/components/selects), for the Role column.

{{"demo": "AutoStopEditComponent.js", "bg": "inline", "defaultCodeOpen": false}}

> ⚠ We don't recommend using edit components with auto-stop in columns that use long-running `preProcessEditCellProps` because the UI will freeze while waiting for `apiRef.current.setEditCellValue`.
> Instead, use the provided stop editing interactions to stop the edit mode.

## Row editing

Row editing allows to edit all the cells of a row at once.
It is based on the cell editing, so everything written above remains valid.
To enable it, change the `editMode` prop to `"row"`, then set normally the `editable` property in the definition of the columns that should be editable.

```tsx
<DataGrid editMode="row" columns={[{ field: 'name', editable: true }]} />
```

Below there is a demo with row editing.
To [start](#start-editing) and [stop](#stop-editing) editing use the same shortcuts from the cell editing (e.g. double-clicking a cell).

{{"demo": "BasicRowEditingGrid.js", "bg": "inline", "defaultCodeOpen": false}}

> ⚠ By design, when changing the value of a cell all `preProcessEditCellProps` callbacks from other columns are also called.
> This happens to allow conditional validation (explained below) where the value of a cell impacts on the validation status of a another cell in the same row.
> To only run validation if the value has changed check if the `hasChanged` param is `true`.

### Conditional validation

Having all cells of a row in edit mode allows validating a field based on the value of another one.
To do that, start by adding the `preProcessEditCellProps` as explained in the [validation](#validation) section.
When the callback is called, it will have an additional `otherFieldsProps` param contaning the props from the other fields in the same row.
Use this param to check if the value from the current column is valid or not.
Return normally the modified `props` containing the error.
Once at the least one field has the `error` attribute equals to a truthy value the row will not leave the edit mode.

The following demo requires a value for the "Payment method" column only if the "Is paid?" column was checked.

{{"demo": "ConditionalValidationGrid.js", "disableAd": true, "bg": "inline", "defaultCodeOpen": false}}

### Full-featured CRUD [<span class="plan-pro"></span>](https://mui.com/store/items/material-ui-pro/)

The row editing makes possible to create a full-featured CRUD similar to those found in enterprise applications.
In the following demo, the typical ways to start and stop editing are all disabled.
Instead, use the buttons available in each row or in the toolbar.

{{"demo": "FullFeaturedCrudGrid.js", "bg": "inline", "disableAd": true, "defaultCodeOpen": false}}

## apiRef [<span class="plan-pro"></span>](https://mui.com/store/items/material-ui-pro/)

{{"demo": "EditApiNoSnap.js", "bg": "inline", "hideToolbar": true}}

## API

- [DataGrid](/api/data-grid/data-grid/)
- [DataGridPro](/api/data-grid/data-grid-pro/)
