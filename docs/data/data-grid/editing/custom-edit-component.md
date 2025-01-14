# Data Grid - Custom edit component

<p class="description">Creating custom edit component.</p>

Each of the built-in column types provides a component to edit the value of the cells.
To customize column types, or override the existing components, you can provide a new edit component through the `renderEditCell()` property in the column definition.
This property works like the `renderCell()` property, which is rendered while cells are in view mode.

```tsx
function CustomEditComponent(props: GridRenderEditCellParams) {
  return <input type="text" value={params.value} onValueChange={...} />;
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

The `renderEditCell()` property receives all params from `GridRenderEditCellParams`, which extends `GridCellParams`.
Additionally, the props added during [pre-processing](#validation) are also available in the params.
These are the most important params to consider:

- `value`: contains the current value of the cell in edit mode, overriding the value from `GridCellParams`
- `error`: the error added during validation
- `isProcessingProps`: whether `preProcessEditCellProps()` is being executed or not

Once a new value is entered into the input, it must be sent to the data grid.
To do this, pass the row ID, the column field, and the new cell value to a call to `apiRef.current.setEditCellValue()`.
The new value will be parsed and validated, and the `value` prop will reflect the changes in the next render.

```tsx
function CustomEditComponent(props: GridRenderEditCellParams) {
  const { id, value, field } = props;
  const apiRef = useGridApiContext();

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value; // The new value entered by the user
    apiRef.current.setEditCellValue({ id, field, value: newValue });
  };

  return <input type="text" value={value} onChange={handleValueChange} />;
}
```

The following demo implements a custom edit component, based on the [`Rating`](https://mui.com/material-ui/react-rating/) component from `@mui/material`, for the **Rating** column.

{{"demo": "CustomEditComponent.js", "bg": "inline", "defaultCodeOpen": false}}

## With debounce

By default, each call to `apiRef.current.setEditCellValue()` triggers a new render.
If the edit component requires the user to type a new value, re-rendering the data grid too often will drastically reduce performance.
One way to avoid this is to debounce the API calls.
You can use `apiRef.current.setEditCellValue()` to handle debouncing by setting the `debounceMs` param to a positive integer that defines a set time period in milliseconds.
No matter how many times the API method is called, the data grid will only be re-rendered after that period of time has passed.

```tsx
apiRef.current.setEditCellValue({ id, field, value: newValue, debounceMs: 200 });
```

When the data grid is only set to re-render after a given period of time has passed, the `value` prop will not be updated on each `apiRef.current.setEditCellValue()` call.
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

## With auto-stop

An edit component has "auto-stop" behavior when it stops edit mode as soon as the value is changed.
To picture better, imagine an edit component with a combo, created following the normal steps.
By default, it would require two clicks to change the value of the cell: one click inside the cell to select a new value, and another click outside the cell to save.
This second click can be avoided if the first click also stops the edit mode.
To create an edit component with auto-stop, call `apiRef.current.stopCellEditMode()` after setting the new value.
Since `apiRef.current.setEditCellValue()` may do additional processing, you must wait for it to resolve before stopping the edit mode.
Also, it is a good practice to check if `apiRef.current.setEditCellValue()` has returned `true`.
It will be `false` if `preProcessEditProps()` set an error during [validation](#validation).

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
Avoid using edit components with auto-stop in columns that use long-running `preProcessEditCellProps()` because the UI will freeze while waiting for `apiRef.current.setEditCellValue()`.
Instead, use the provided interactions to exit edit mode.
:::

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
