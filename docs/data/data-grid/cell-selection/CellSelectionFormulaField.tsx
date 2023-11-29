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
      const updatedRow = { ...apiRef.current.getRow(id) };

      Object.entries(fields).forEach(([field, isSelected]) => {
        if (isSelected) {
          updatedRow[field] = value;
        }
      });

      updates.push(updatedRow);
    });

    apiRef.current.updateRows(updates);
  }, [apiRef, cellSelectionModel, value]);

  React.useEffect(() => {
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
