# Data Grid - Editing

<p class="description">The data grid has built-in support for cell and row editing.</p>

## Full-featured CRUD

The data grid is not only a data visualization tool. It offers built-in editing features for you to manage your data set.
The following demo shows a full-featured CRUD (Create, Read, Update, Delete) typically found in enterprise applications.

:::info
You will find the details of the editing API in the next sections.
:::

{{"demo": "FullFeaturedCrudGrid.js", "bg": "inline", "defaultCodeOpen": false}}

## Making a column editable

You can make a column editable by enabling the `editable` property in its [column definition](/x/api/data-grid/grid-col-def/).

This lets the user edit any cell from the specified columns.
For example, with the code snippet below, users can edit cells in the `name` column, but not in the `id` column.

```tsx
<DataGrid columns={[{ field: 'id' }, { field: 'name', editable: true }]} />
```

The following demo shows an example of how to make all columns editable.
Play with it by double-clicking or pressing <kbd class="key">Enter</kbd> on any cell.

{{"demo": "BasicEditingGrid.js", "bg": "inline", "defaultCodeOpen": false}}

## Row editing

By default, only one cell can be editable at a time.
But you can let your user edit all cells in a row simultaneously.

To enable this behavior, set the `editMode` prop on the Data Grid to `"row"`. Note that you still need to set the `editable` property in each column definition to specify which of them are editable; the same basic rules for cell editing also apply to row editing.

```tsx
<DataGrid editMode="row" columns={[{ field: 'name', editable: true }]} />
```

The following demo illustrates how row editing works.
The user can [start](#start-editing) and [stop](#stop-editing) editing a row using the same actions as those provided for cell editing (for example double-clicking a cell).

{{"demo": "BasicRowEditingGrid.js", "bg": "inline", "defaultCodeOpen": false}}

:::warning
By design, when changing the value of a cell all `preProcessEditCellProps` callbacks from other columns are also called.
This lets you apply conditional validation where the value of a cell impacts the validation status of another cell in the same row.
If you only want to run validation when the value has changed, check if the `hasChanged` param is `true`.

For more details on how to use `preProcessEditCellProps`, please check the editing [validation](#validation) section.
:::

## Switching between edit and view modes

Each cell and row has two modes: `edit` and `view`. When in `edit` mode, users can directly change the content of a cell or a row.

### Start editing

When a cell is in `view` mode, users can start editing a cell (or row if `editMode="row"`) with any of the following actions:

- Double-clicking a cell
- Pressing <kbd class="key">Enter</kbd>, <kbd class="key">Backspace</kbd> or <kbd class="key">Delete</kbd>—note that the latter two options both delete any existing content
- Pressing any printable key, such as <kbd class="key">a</kbd>, <kbd class="key">E</kbd>, <kbd class="key">0</kbd>, or <kbd class="key">$</kbd>
- Calling `apiRef.current.startCellEditMode` passing the row ID and column field of the cell to be edited

  ```tsx
  apiRef.current.startCellEditMode({ id: 1, field: 'name' });
  ```

- Calling `apiRef.current.startRowEditMode` passing the ID of the row (only available if `editMode="row"`).

  ```tsx
  apiRef.current.startRowEditMode({ id: 1 });
  ```

:::info
You can also enter edit mode with a single click by following [this recipe](/x/react-data-grid/recipes-editing/#single-click-editing).
:::

### Stop editing

When a cell is in `edit` mode, the user can stop editing with any of the following interactions:

- Pressing <kbd class="key">Escape</kbd>—this also reverts any changes made
- Pressing <kbd class="key">Tab</kbd>—this also saves any changes made
- Pressing <kbd class="key">Enter</kbd>—this also saves any changes made and moves the focus to the next cell in the same column
- Clicking outside the cell or row—this also saves any changes made
- Calling `apiRef.current.stopCellEditMode({ id, field })` passing the row ID and column field of the cell that's been edited

  ```tsx
  apiRef.current.stopCellEditMode({ id: 1, field: 'name' });

  // or

  apiRef.current.stopCellEditMode({
    id: 1,
    field: 'name',
    ignoreModifications: true, // will also discard the changes made
  });
  ```

- Calling `apiRef.current.stopRowEditMode` passing the ID of the row (only possible if `editMode="row"`).

  ```tsx
  apiRef.current.stopRowEditMode({ id: 1 });

  // or

  apiRef.current.stopRowEditMode({
    id: 1,
    ignoreModifications: true, // will also discard the changes made
  });
  ```

### Editing events

The interactions that [start](#start-editing) and [stop](#stop-editing) trigger `'cellEditStart'` and `'cellEditStop'` [events](/x/react-data-grid/events/), respectively.
For [row editing](#row-editing), the events are `'rowEditStart'` and `'rowEditStop'`.
You can control how these events are handled to customize editing behavior.

For convenience, you can also listen to these events using their respective props:

- `onCellEditStart`
- `onCellEditStop`
- `onRowEditStart`
- `onRowEditStop`

These events and props are called with an object containing the row ID and column field of the cell that is being edited.
The object also contains a `reason` param that specifies which type of interaction caused the event to be fired—for instance, `'cellDoubleClick'` when a double-click initiates edit mode.

The following demo shows how to prevent the user from exiting edit mode when clicking outside of a cell.
To do this, the `onCellEditStop` prop is used to check if the `reason` is `'cellFocusOut'`.
If that condition is true, it [disables](/x/react-data-grid/events/#disabling-the-default-behavior) the default event behavior.
In this context, the user can only stop editing a cell by pressing <kbd class="key">Enter</kbd>, <kbd class="key">Escape</kbd> or <kbd class="key">Tab</kbd>.

{{"demo": "DisableStopEditModeOnFocusOut.js", "bg": "inline"}}

### Disable editing of specific cells within a row

The `editable` property controls which cells are editable at the column level.
You can use the `isCellEditable` callback prop to define which individual cells the user can edit in a given row.
It is called with a [`GridCellParams`](/x/api/data-grid/grid-cell-params/) object and must return `true` if the cell is editable, or `false` if not.

In the following demo, only the rows with an even `Age` value are editable.
The editable cells have a green background for better visibility.

{{"demo": "IsCellEditableGrid.js", "bg": "inline"}}

## Server-side persistence

### The `processRowUpdate` callback

When the user performs an action to [stop editing](#stop-editing), the `processRowUpdate` callback is triggered.
Use it to send the new values to the server and save them into a database or other storage method.
The callback is called with two arguments:

1. The updated row with the new values returned by the [`valueSetter`](#value-parser-and-value-setter).
2. The original values of the row before editing.

Please note that the `processRowUpdate` must return the row object to update the Data Grid internal state.
The value returned is used later as an argument on a call to `apiRef.current.updateRows`.

```tsx
<DataGrid
  rows={rows}
  columns={columns}
  processRowUpdate={(updatedRow, originalRow) =>
    mySaveOnServerFunction(updatedRow);
  }
  onProcessRowUpdateError={handleProcessRowUpdateError}
/>
```

If you want to delete a row from the internal state of the Data Grid, you can return an additional property `_action: 'delete'` in the row object from the `processRowUpdate` callback. This will remove the row from the internal state of the Data Grid.
It is a more performant way to delete a row as compared to updating the [`rows` prop](/x/react-data-grid/row-updates/#the-rows-prop) or using `setRows` API method because `processRowUpdate` uses the [`updateRows`](https://mui.com/x/react-data-grid/row-updates/#the-updaterows-method) under the hood which doesn't cause a full regeneration of the row tree.

```tsx
<DataGrid
  {...otherProps}
  processRowUpdate={(updatedRow, originalRow) => {
    if (shouldDeleteRow(updatedRow)) {
      return { ...updatedRow, _action: 'delete' };
    }
    return updatedRow;
  }}
/>
```

In the example above, `shouldDeleteRow` is a function that determines whether a row should be deleted based on the updated row data.
If `shouldDeleteRow` returns `true`, the row will be deleted from the Data Grid's internal state.

### Server-side validation

If you need to cancel the save process on `processRowUpdate`—for instance, when a database validation fails, or the user wants to reject the changes—there are two options:

1. Reject the promise so that the internal state is not updated and the cell remains in edit mode.
2. Resolve the promise with the second argument (original row before editing), so that the internal state is not updated, and the cell exits edit mode.

The following demo implements the first option: rejecting the promise.
Instead of [validating](#validation) while typing, it simulates validation on the server.
If the new name is empty, the promise responsible for saving the row will be rejected, and the cell will remain in edit mode.

The demo also shows that `processRowUpdate` can pre-process the row model that will be saved into the internal state.

Additionally, `onProcessRowUpdateError` is called to display the error message.

To exit edit mode, press <kbd class="key">Escape</kbd> or enter a valid name.

{{"demo": "ServerSidePersistence.js", "bg": "inline", "defaultCodeOpen": false}}

### Confirm before saving

The second option—resolving the promise with the second argument—lets the user cancel the save process by rejecting the changes and exiting the edit mode.
In this case, `processRowUpdate` is resolved with the original value(s) of the row.

The following demo shows how this approach can be used to ask for confirmation before sending the data to the server.
If the user accepts the change, the internal state is updated with the values.
But if the changes are rejected, the internal state remains unchanged, and the cell is reverted back to its original value.
The demo also employs validation to prevent entering an empty name.

{{"demo": "AskConfirmationBeforeSave.js", "bg": "inline", "defaultCodeOpen": false}}

## Value parser and value setter

You can use the `valueParser` property in the column definition to modify the value entered by the user—for example, to convert the value to a different format:

```tsx
const columns: GridColDef[] = [
  {
    valueParser: (value, row, column, apiRef) => {
      return value.toLowerCase();
    },
  },
];
```

You can use the `valueSetter` property of the column definition to customize how the row is updated with a new value.
This lets you insert a value from a nested object.
It is called with an object containing the new cell value to be saved as well as the row that the cell belongs to.
If you are already using a `valueGetter` to extract the value from a nested object, then the `valueSetter` will probably also be necessary.

```tsx
const columns: GridColDef[] = [
  {
    valueSetter: (value, row) => {
      const [firstName, lastName] = value!.toString().split(' ');
      return { ...row, firstName, lastName };
    },
  },
];
```

In the following demo, both the `valueParser` and the `valueSetter` are defined for the **Full name** column.
The `valueParser` capitalizes the value entered, and the `valueSetter` splits the value and saves it correctly into the row model:

{{"demo": "ValueParserSetterGrid.js", "bg": "inline", "defaultCodeOpen": false}}

## Validation

If the column definition sets a callback for the `preProcessEditCellProps` property, then it will be called each time a new value is entered into a cell from this column.
This property lets you pre-process the props that are passed to the edit component.
The `preProcessEditCellProps` callback is called with an object containing the following attributes:

- `id`: the row ID
- `row`: the row model containing the value(s) of the cell or row before entering edit mode
- `props`: the props, containing the value after the value parser, that are passed to the edit component
- `hasChanged`: determines if `props.value` is different from the last time this callback was called

Data validation is one type of pre-processing that can be done in this way.
To validate the data entered, pass a callback to `preProcessEditCellProps` checking if `props.value` is valid.
If the new value is invalid, set `props.error` to a truthy value and return the modified props, as shown in the example below.
When the user tries to save the updated value, the change will be rejected if the error attribute is truthy (invalid).

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

:::warning
Changing `props.value` inside the callback has no effect. To pre-process it, use a [value parser](#value-parser-and-value-setter).
:::

The demo below contains an example of server-side data validation.
In this case, the callback returns a promise that resolves to the modified props.
Note that the value passed to `props.error` is passed directly to the edit component as the `error` prop.
While the promise is not resolved, the edit component will receive an `isProcessingProps` prop with value equal to `true`.

{{"demo": "ValidateServerNameGrid.js", "bg": "inline", "defaultCodeOpen": false}}

## Controlled model

You can control the active mode using the props `cellModesModel` and `rowModesModel` (only works if `editMode="row"`).

The `cellModesModel` prop accepts an object containing the `mode` (and additional options) for a given column field, in a given row, as in the following example.
The options accepted are the same available in [`apiRef.current.startCellEditMode`](#start-editing) and [`apiRef.current.stopCellEditMode`](#stop-editing).

```tsx
// Changes the mode of field=name from row with id=1 to "edit"
<DataGrid
  cellModesModel={{ 1: { name: { mode: GridCellModes.Edit } } }}
/>

// Changes the mode of field=name from row with id=1 to "view", ignoring modifications made
<DataGrid
  cellModesModel={{ 1: { name: { mode: GridCellModes.View, ignoreModifications: true } } }}
/>
```

For row editing, the `rowModesModel` props work in a similar manner.
The options accepted are the same available in [`apiRef.current.startRowEditMode`](#start-editing) and [`apiRef.current.stopRowEditMode`](#stop-editing).

```tsx
// Changes the mode of the row with id=1 to "edit"
<DataGrid
  editMode="row"
  rowModesModel={{ 1: { mode: GridRowModes.Edit } }}
/>

// Changes the mode of the row with id=1 to "view", ignoring modifications made
<DataGrid
  editMode="row"
  rowModesModel={{ 1: { mode: GridRowModes.View, ignoreModifications: true } }}
/>
```

Additionally, the callback props `onCellModesModelChange` and `onRowModesModelChange` (only works if `editMode="row"`) are available.
Use them to update the respective prop.

In the demo below, `cellModesModel` is used to control the mode of selected cell using the external buttons.
For an example using row editing check the [full-featured CRUD component](#full-featured-crud-component).

{{"demo": "StartEditButtonGrid.js", "bg": "inline", "defaultCodeOpen": false}}

:::warning
The options passed to both model props only take effect when `mode` changes.
Updating the params of a cell or row, but keeping the same `mode`, makes the cell or row to stay in the same mode.
Also, removing one field or row ID from the object will not cause the missing cell or row to go to `"view"` mode.
:::

## Create your own edit component

Each of the built-in column types provides a component to edit the value of the cells.
To customize column types, or override the existing components, you can provide a new edit component through the `renderEditCell` property in the column definition.
This property works like the `renderCell` property, with the difference that it is rendered while cells are in edit mode.

```tsx
function CustomEditComponent(props: GridRenderEditCellParams) {
  return <input type="text" value={params.value} onChange={...} />;
}

const columns: GridColDef[] = [
  {
    field: 'firstName',
    renderEditCell: (params: GridRenderEditCellParams) => (
      <CustomEditComponent {...params} />
    ),
  },
];
```

The `renderEditCell` property receives all params from `GridRenderEditCellParams`, which extends `GridCellParams`.
Additionally, the props added during [pre-processing](#validation) are also available in the params.
These are the most important params to consider:

- `value`: contains the current value of the cell in edit mode, overriding the value from `GridCellParams`
- `error`: the error added during validation
- `isProcessingProps`: whether `preProcessEditCellProps` is being executed or not

Once a new value is entered into the input, it must be sent to the data grid.
To do this, pass the row ID, the column field, and the new cell value to a call to `apiRef.current.setEditCellValue`.
The new value will be parsed and validated, and the `value` prop will reflect the changes in the next render.

It's important to also handle the [accessibility](/x/react-data-grid/accessibility/) of custom edit components.
When a cell enters edit mode, an element must be focused to provide access via keyboard and for screen readers.
Since multiple cells may be in edit mode at the same time, the `hasFocus` prop will be `true` on the cell that should have focus.
Use this prop to focus the appropriate element.

```tsx
function CustomEditComponent(props: GridRenderEditCellParams) {
  const { id, value, field, hasFocus } = props;
  const apiRef = useGridApiContext();
  const ref = React.useRef();

  React.useLayoutEffect(() => {
    if (hasFocus) {
      ref.current.focus();
    }
  }, [hasFocus]);

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value; // The new value entered by the user
    apiRef.current.setEditCellValue({ id, field, value: newValue });
  };

  return <input ref={ref} type="text" value={value} onChange={handleValueChange} />;
}
```

The following demo implements a custom edit component, based on the [`Rating`](https://mui.com/material-ui/react-rating/) component from `@mui/material`, for the **Rating** column.

{{"demo": "CustomEditComponent.js", "bg": "inline", "defaultCodeOpen": false}}

### With debounce

By default, each call to `apiRef.current.setEditCellValue` triggers a new render.
If the edit component requires the user to type a new value, re-rendering the data grid too often will drastically reduce performance.
One way to avoid this is to debounce the API calls.
You can use `apiRef.current.setEditCellValue` to handle debouncing by setting the `debounceMs` param to a positive integer that defines a set time period in milliseconds.
No matter how many times the API method is called, the data grid will only be re-rendered after that period of time has passed.

```tsx
apiRef.current.setEditCellValue({ id, field, value: newValue, debounceMs: 200 });
```

When the data grid is only set to re-render after a given period of time has passed, the `value` prop will not be updated on each `apiRef.current.setEditCellValue` call.
To avoid a frozen UI, the edit component can keep the current value in an internal state and sync it once `value` changes.
Modify the edit component to enable this feature:

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
   return <input type="text" value={value} onChange={handleChange} />;
 }
```

### With auto-stop

An edit component has "auto-stop" behavior when it stops edit mode as soon as the value is changed.
To picture better, imagine an edit component with a combo, created following the normal [steps](#create-your-own-edit-component).
By default, it would require two clicks to change the value of the cell: one click inside the cell to select a new value, and another click outside the cell to save.
This second click can be avoided if the first click also stops the edit mode.
To create an edit component with auto-stop, call `apiRef.current.stopCellEditMode` after setting the new value.
Since `apiRef.current.setEditCellValue` may do additional processing, you must wait for it to resolve before stopping the edit mode.
Also, it is a good practice to check if `apiRef.current.setEditCellValue` has returned `true`.
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

The following demo implements an edit component with auto-stop, based on a native [`Select`](/material-ui/react-select/) component for the **Role** column.

{{"demo": "AutoStopEditComponent.js", "bg": "inline", "defaultCodeOpen": false}}

:::warning
Avoid using edit components with auto-stop in columns that use long-running `preProcessEditCellProps` because the UI will freeze while waiting for `apiRef.current.setEditCellValue`.
Instead, use the provided interactions to exit edit mode.
:::

## Advanced use cases

The [Editing recipes](/x/react-data-grid/recipes-editing/) page covers more advanced use cases, such as:

- [Multiline editing](/x/react-data-grid/recipes-editing/#multiline-editing)
- [Single click editing](/x/react-data-grid/recipes-editing/#single-click-editing)
- [Bulk editing](/x/react-data-grid/recipes-editing/#bulk-editing)
- [Conditional validation](/x/react-data-grid/recipes-editing/#conditional-validation)
- [Linked fields](/x/react-data-grid/recipes-editing/#linked-fields)

## apiRef

The grid exposes a set of methods that enables all of these features using the imperative `apiRef`. To know more about how to use it, check the [API Object](/x/react-data-grid/api-object/) section.

{{"demo": "EditApiNoSnap.js", "bg": "inline", "hideToolbar": true}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
