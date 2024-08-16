import * as React from 'react';
import { DataGridPro, useGridApiRef, GridColDef } from '@mui/x-data-grid-pro';
import {
  randomInt,
  randomUserName,
  randomArrayItem,
} from '@mui/x-data-grid-generator';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

const columns: GridColDef[] = [
  { field: 'id' },
  { field: 'username', width: 150 },
  { field: 'age', width: 80, type: 'number' },
];

let idCounter = 0;
const createRandomRow = () => {
  idCounter += 1;
  return { id: idCounter, username: randomUserName(), age: randomInt(10, 80) };
};

const rows = [
  createRandomRow(),
  createRandomRow(),
  createRandomRow(),
  createRandomRow(),
];

export default function UpdateRowsApiRef() {
  const apiRef = useGridApiRef();

  const handleUpdateRow = () => {
    const rowIds = apiRef.current.getAllRowIds();
    const rowId = randomArrayItem(rowIds);

    apiRef.current.updateRows([{ id: rowId, username: randomUserName() }]);
  };

  const handleUpdateAllRows = () => {
    const rowIds = apiRef.current.getAllRowIds();

    apiRef.current.updateRows(
      rowIds.map((rowId) => ({ id: rowId, username: randomUserName() })),
    );
  };

  const handleDeleteRow = () => {
    const rowIds = apiRef.current.getAllRowIds();
    const rowId = randomArrayItem(rowIds);

    apiRef.current.updateRows([{ id: rowId, _action: 'delete' }]);
  };

  const handleAddRow = () => {
    apiRef.current.updateRows([createRandomRow()]);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction="row" spacing={1}>
        <Button size="small" onClick={handleUpdateRow}>
          Update a row
        </Button>
        <Button size="small" onClick={handleUpdateAllRows}>
          Update all rows
        </Button>
        <Button size="small" onClick={handleDeleteRow}>
          Delete a row
        </Button>
        <Button size="small" onClick={handleAddRow}>
          Add a row
        </Button>
      </Stack>
      <Box sx={{ height: 400, mt: 1 }}>
        <DataGridPro apiRef={apiRef} rows={rows} columns={columns} />
      </Box>
    </Box>
  );
}
