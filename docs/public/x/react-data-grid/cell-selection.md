---
title: Data Grid - Cell selection
---

# Data Grid - Cell selection [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

Let users select individual cells or a range of cells.

## Enabling cell selection

By default, the Data Grid lets users select individual rows.
With the Data Grid Premium, you can apply the `cellSelection` prop to let users select individual cells or ranges of cells.

```tsx
<DataGridPremium cellSelection />
```

## Selecting cells

With the `cellSelection` prop applied, users can select a single cell by clicking on it, or by pressing <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Space</kbd></kbd> when the cell is in focus.
Select multiple cells by holding <kbd class="key">Cmd</kbd> (or <kbd class="key">Ctrl</kbd> on Windows) while clicking on them.
Hold <kbd class="key">Cmd</kbd> (or <kbd class="key">Ctrl</kbd> on Windows) and click on a selected cell to deselect it.

To select a range of cells, users can:

- Click on a cell, drag the mouse over nearby cells, and then release.
- Click on a cell, then hold <kbd class="key">Shift</kbd> and click on another cell. If a third cell is clicked then the selection will restart from the last clicked cell.
- Use the arrow keys to focus on a cell, then hold <kbd class="key">Shift</kbd> and navigate to another cell—if <kbd class="key">Shift</kbd> is released and pressed again then the selection will restart from the last focused cell.

Try out the various actions to select cells in the demo below—you can toggle [row selection](/x/react-data-grid/row-selection/) on and off to see how these two selection features can work in parallel.

```tsx
import * as React from 'react';
import Button from '@mui/material/Button';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function CellSelectionGrid() {
  const [rowSelection, setRowSelection] = React.useState(false);

  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 6,
  });

  return (
    <div style={{ width: '100%' }}>
      <Button sx={{ mb: 1 }} onClick={() => setRowSelection(!rowSelection)}>
        Toggle row selection
      </Button>
      <div style={{ height: 400 }}>
        <DataGridPremium
          rowSelection={rowSelection}
          checkboxSelection={rowSelection}
          cellSelection
          {...data}
        />
      </div>
    </div>
  );
}

```

## Controlling cell selection

You can control which cells are selected using the `cellSelectionModel` prop.
This prop accepts an object with keys corresponding to the row IDs that contain selected cells.
The value of each key is itself an object, which has a column field for a key and a boolean value for its selection state.
You can set this to `true` to select a cell or `false` to deselect it.
Removing the field from the object also deselects the cell.

```tsx
// Selects the cell with field=name from row with id=1
<DataGridPremium cellSelectionModel={{ 1: { name: true } }} />

// Unselects the cell with field=name from row with id=1
<DataGridPremium cellSelectionModel={{ 1: { name: false } }} />
```

When a new selection is made, the callback passed to the `onCellSelectionModelChange` prop is called with the updated model.
Use this value to update the current model.

The following demo shows how these props can be combined to create an Excel-like formula field—try updating multiple cells at once by selecting them and entering a new value in the field at the top.

```tsx
import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import {
  DataGridPremium,
  GridCellSelectionModel,
  GridRowModelUpdate,
  useGridApiRef,
} from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function CellSelectionFormulaField() {
  const apiRef = useGridApiRef();
  const [value, setValue] = React.useState('');
  const [cellSelectionModel, setCellSelectionModel] =
    React.useState<GridCellSelectionModel>({});
  const [numberOfSelectedCells, setNumberOfSelectedCells] = React.useState(0);

  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 6,
  });

  const handleCellSelectionModelChange = React.useCallback(
    (newModel: GridCellSelectionModel) => {
      setCellSelectionModel(newModel);
    },
    [],
  );

  const handleValueChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value);
    },
    [],
  );

  const updateSelectedCells = React.useCallback(() => {
    const updates: GridRowModelUpdate[] = [];

    Object.entries(cellSelectionModel).forEach(([id, fields]) => {
      const updatedRow = { ...apiRef.current?.getRow(id) };

      Object.entries(fields).forEach(([field, isSelected]) => {
        if (isSelected) {
          updatedRow[field] = value;
        }
      });

      updates.push(updatedRow);
    });

    apiRef.current?.updateRows(updates);
  }, [apiRef, cellSelectionModel, value]);

  React.useEffect(() => {
    if (apiRef.current === null) {
      return;
    }

    const selectedCells = apiRef.current.getSelectedCellsAsArray();
    setNumberOfSelectedCells(selectedCells.length);

    if (selectedCells.length > 1) {
      setValue('(multiple values)');
    } else if (selectedCells.length === 1) {
      setValue(
        apiRef.current.getCellValue(selectedCells[0].id, selectedCells[0].field),
      );
    } else {
      setValue('');
    }
  }, [apiRef, cellSelectionModel]);

  return (
    <div style={{ width: '100%' }}>
      <Stack sx={{ mb: 1 }} direction="row" spacing={2}>
        <TextField
          label="Selected cell value"
          disabled={numberOfSelectedCells === 0}
          value={value}
          onChange={handleValueChange}
          fullWidth
        />
        <Button disabled={numberOfSelectedCells === 0} onClick={updateSelectedCells}>
          Update selected cells
        </Button>
      </Stack>
      <div style={{ height: 400 }}>
        <DataGridPremium
          apiRef={apiRef}
          rowSelection={false}
          cellSelectionModel={cellSelectionModel}
          onCellSelectionModelChange={handleCellSelectionModelChange}
          cellSelection
          {...data}
        />
      </div>
    </div>
  );
}

```

## Customizing range styles

When multiple selected cells form a continuous range of any size, the following class names are applied to the cells at the edges:

- `MuiDataGrid-cell--rangeTop`: to all cells in the first row of the range
- `MuiDataGrid-cell--rangeBottom`: to all cells in the last row of the range
- `MuiDataGrid-cell--rangeLeft`: to all cells in the first column of the range
- `MuiDataGrid-cell--rangeRight`: to all cells in the last column of the range

:::info
When a single cell is selected, all classes above are applied to that element.
:::

You can use these classes to create CSS selectors targeting specific corners of each range—for example, the demo below adds a border around the outside of the range.

```tsx
import * as React from 'react';
import { styled, lighten, darken, alpha } from '@mui/material/styles';
import { DataGridPremium, gridClasses } from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';

const StyledDataGridPremium = styled(DataGridPremium)(({ theme }) => {
  const lightBorderColor = lighten(alpha(theme.palette.divider, 1), 0.88);
  const darkBorderColor = darken(alpha(theme.palette.divider, 1), 0.68);

  const selectedCellBorder = alpha(theme.palette.primary.main, 0.5);

  return {
    [`& .${gridClasses.cell}`]: {
      border: `1px solid transparent`,
      borderRight: `1px solid ${lightBorderColor}`,
      borderBottom: `1px solid ${lightBorderColor}`,
      ...theme.applyStyles('dark', {
        borderRightColor: `${darkBorderColor}`,
        borderBottomColor: `${darkBorderColor}`,
      }),
    },
    [`& .${gridClasses.cell}.Mui-selected`]: {
      borderColor: alpha(theme.palette.primary.main, 0.1),
    },
    [`& .${gridClasses.cell}.Mui-selected.${gridClasses['cell--rangeTop']}`]: {
      borderTopColor: selectedCellBorder,
    },
    [`& .${gridClasses.cell}.Mui-selected.${gridClasses['cell--rangeBottom']}`]: {
      borderBottomColor: selectedCellBorder,
    },
    [`& .${gridClasses.cell}.Mui-selected.${gridClasses['cell--rangeLeft']}`]: {
      borderLeftColor: selectedCellBorder,
    },
    [`& .${gridClasses.cell}.Mui-selected.${gridClasses['cell--rangeRight']}`]: {
      borderRightColor: selectedCellBorder,
    },
  };
});

export default function CellSelectionRangeStyling() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <StyledDataGridPremium rowSelection={false} cellSelection {...data} />
    </div>
  );
}

```

## apiRef

The Data Grid exposes a set of methods via the `apiRef` object that are used internally in the implementation of the cell selection feature.
The reference below describes the relevant functions.
See [API object](/x/react-data-grid/api-object/) for more details.

:::warning
This API should only be used as a last resort when the Data Grid's built-in props aren't sufficient for your specific use case.
:::

```jsx
import * as React from 'react';
import ApiDocs from 'docsx/src/modules/components/ApiDocs';
import premiumApi from 'docsx/pages/x/api/data-grid/grid-cell-selection-api.json';

export default function CellSelectionApiNoSnap() {
  return <ApiDocs premiumApi={premiumApi} />;
}

```

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
