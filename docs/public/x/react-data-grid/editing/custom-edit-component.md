# Data Grid - Custom edit component

Creating custom edit component.

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

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import {
  DataGrid,
  GridRenderCellParams,
  GridColDef,
  useGridApiContext,
} from '@mui/x-data-grid';

function renderRating(params: GridRenderCellParams<any, number>) {
  return <Rating readOnly value={params.value} />;
}

function RatingEditInputCell(props: GridRenderCellParams<any, number>) {
  const { id, value, field, hasFocus } = props;
  const apiRef = useGridApiContext();
  const ref = React.useRef<HTMLElement>(null);

  const handleChange = (event: React.SyntheticEvent, newValue: number | null) => {
    apiRef.current.setEditCellValue({ id, field, value: newValue });
  };

  useEnhancedEffect(() => {
    if (hasFocus && ref.current) {
      const input = ref.current.querySelector<HTMLInputElement>(
        `input[value="${value}"]`,
      );
      input?.focus();
    }
  }, [hasFocus, value]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', pr: 2 }}>
      <Rating
        ref={ref}
        name="rating"
        precision={1}
        value={value}
        onChange={handleChange}
      />
    </Box>
  );
}

const renderRatingEditInputCell: GridColDef['renderCell'] = (params) => {
  return <RatingEditInputCell {...params} />;
};

export default function CustomEditComponent() {
  return (
    <div style={{ height: 250, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
}

const columns: GridColDef[] = [
  {
    field: 'places',
    headerName: 'Places',
    width: 120,
  },
  {
    field: 'rating',
    headerName: 'Rating',
    display: 'flex',
    renderCell: renderRating,
    renderEditCell: renderRatingEditInputCell,
    editable: true,
    width: 180,
    type: 'number',
  },
];

const rows = [
  { id: 1, places: 'Barcelona', rating: 5 },
  { id: 2, places: 'Rio de Janeiro', rating: 4 },
  { id: 3, places: 'London', rating: 3 },
  { id: 4, places: 'New York', rating: 2 },
];

```

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

```tsx
import * as React from 'react';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {
  DataGrid,
  GridRenderCellParams,
  GridColDef,
  useGridApiContext,
} from '@mui/x-data-grid';

function SelectEditInputCell(props: GridRenderCellParams) {
  const { id, value, field } = props;
  const apiRef = useGridApiContext();

  const handleChange = async (event: SelectChangeEvent) => {
    await apiRef.current.setEditCellValue({ id, field, value: event.target.value });
    apiRef.current.stopCellEditMode({ id, field });
  };

  return (
    <Select
      value={value}
      onChange={handleChange}
      size="small"
      sx={{ height: 1 }}
      native
      autoFocus
    >
      <option>Back-end Developer</option>
      <option>Front-end Developer</option>
      <option>UX Designer</option>
    </Select>
  );
}

const renderSelectEditInputCell: GridColDef['renderCell'] = (params) => {
  return <SelectEditInputCell {...params} />;
};

export default function AutoStopEditComponent() {
  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
}

const columns = [
  {
    field: 'name',
    headerName: 'Name',
    width: 120,
  },
  {
    field: 'role',
    headerName: 'Role',
    renderEditCell: renderSelectEditInputCell,
    editable: true,
    width: 180,
  },
];

const rows = [
  {
    id: 1,
    name: 'Olivier',
    role: 'Back-end Developer',
  },
  {
    id: 2,
    name: 'Danail',
    role: 'UX Designer',
  },
  {
    id: 3,
    name: 'Matheus',
    role: 'Front-end Developer',
  },
];

```

:::warning
Avoid using edit components with auto-stop in columns that use long-running `preProcessEditCellProps()` because the UI will freeze while waiting for `apiRef.current.setEditCellValue()`.
Instead, use the provided interactions to exit edit mode.
:::

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
