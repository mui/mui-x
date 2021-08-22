import * as React from 'react';
import { DataGridPro, GridRowData, useGridApiRef } from '@mui/x-data-grid-pro';
import { interval } from 'rxjs';
import { randomInt, randomUserName } from '@mui/x-data-grid-generator';

const columns = [
  { field: 'id' },
  { field: 'username', width: 150 },
  { field: 'age', width: 80, type: 'number' },
];

interface ApiRefRowsGridRow {
  id: number;
  username: string;
  age: number;
}

const rows: GridRowData<ApiRefRowsGridRow>[] = [
  { id: 1, username: randomUserName(), age: randomInt(10, 80) },
  { id: 2, username: randomUserName(), age: randomInt(10, 80) },
  { id: 3, username: randomUserName(), age: randomInt(10, 80) },
  { id: 4, username: randomUserName(), age: randomInt(10, 80) },
];

export default function ApiRefRowsGrid() {
  const apiRef = useGridApiRef();

  React.useEffect(() => {
    const subscription = interval(200).subscribe(() => {
      apiRef.current.updateRows([
        {
          id: randomInt(1, 4),
          username: randomUserName(),
          age: randomInt(10, 80),
        },
        {
          id: randomInt(1, 4),
          username: randomUserName(),
          age: randomInt(10, 80),
        },
      ]);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [apiRef]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro rows={rows} columns={columns} apiRef={apiRef} />
    </div>
  );
}
