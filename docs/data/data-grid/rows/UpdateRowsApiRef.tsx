import * as React from 'react';
import { DataGridPro, useGridApiRef } from '@mui/x-data-grid-pro';
import {
  randomInt,
  randomUserName,
  randomArrayItem,
} from '@mui/x-data-grid-generator';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

const columns = [
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
    <div style={{ width: '100%' }}>
      <Stack
        sx={{ width: '100%', mb: 1 }}
        direction="row"
        alignItems="flex-start"
        columnGap={1}
      >
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
      <Box sx={{ height: 400, bgcolor: 'background.paper' }}>
        <DataGridPro apiRef={apiRef} hideFooter rows={rows} columns={columns} />
      </Box>
    </div>
  );
}
