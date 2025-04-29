# Data Grid - Editing

<p class="description">The Data Grid has built-in support for cell and row editing.</p>

## Full-featured CRUD

The Data Grid is not only a data visualization tool. It offers built-in editing features for you to manage your data set.
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

### Disable editing of specific cells within a row

The `editable` property controls which cells are editable at the column level.
You can use the `isCellEditable` callback prop to define which individual cells the user can edit in a given row.
It is called with a [`GridCellParams`](/x/api/data-grid/grid-cell-params/) object and must return `true` if the cell is editable, or `false` if not.

In the following demo, only the rows with an even `Age` value are editable.
The editable cells have a green background for better visibility.

{{"demo": "IsCellEditableGrid.js", "bg": "inline"}}

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
If you are already using a `valueGetter` to extract the value from a nested object, then the `valueSetter` is probably also necessary.

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
The options accepted are the same available in [`apiRef.current.startCellEditMode()`](#start-editing) and [`apiRef.current.stopCellEditMode()`](#stop-editing).

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
The options accepted are the same available in [`apiRef.current.startRowEditMode()`](#start-editing) and [`apiRef.current.stopRowEditMode()`](#stop-editing).

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

Additionally, the callback props `onCellModesModelChange()` and `onRowModesModelChange()` (only works if `editMode="row"`) are available.
Use them to update the respective prop.

In the demo below, `cellModesModel` is used to control the mode of selected cell using the external buttons.
For an example using row editing check the [full-featured CRUD component](#full-featured-crud-component).

{{"demo": "StartEditButtonGrid.js", "bg": "inline", "defaultCodeOpen": false}}

:::warning
The options passed to both model props only take effect when `mode` changes.
Updating the params of a cell or row, but keeping the same `mode`, makes the cell or row to stay in the same mode.
Also, removing one field or row ID from the object will not cause the missing cell or row to go to `"view"` mode.
:::

## apiRef

The grid exposes a set of methods that enables all of these features using the imperative `apiRef`. To know more about how to use it, check the [API Object](/x/react-data-grid/api-object/) section.

{{"demo": "EditApiNoSnap.js", "bg": "inline", "hideToolbar": true}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
