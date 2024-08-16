import * as React from 'react';
import { DataGridPro, useGridApiRef, GridColDef } from '@mui/x-data-grid-pro';
import { interval } from 'rxjs';
import { randomInt, randomUserName } from '@mui/x-data-grid-generator';

const columns: GridColDef[] = [
  { field: 'id' },
  { field: 'username', width: 150 },
  { field: 'age', width: 80, type: 'number' },
];

const rows = [
  { id: 1, username: randomUserName(), age: randomInt(10, 80) },
  { id: 2, username: randomUserName(), age: randomInt(10, 80) },
  { id: 3, username: randomUserName(), age: randomInt(10, 80) },
  { id: 4, username: randomUserName(), age: randomInt(10, 80) },
];

export default function ThrottledRowsGrid() {
  const apiRef = useGridApiRef();

  React.useEffect(() => {
    const subscription = interval(10).subscribe(() => {
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
      <DataGridPro
        rows={rows}
        columns={columns}
        apiRef={apiRef}
        throttleRowsMs={2000}
      />
    </div>
  );
}
