import * as React from 'react';
import { XGrid, useApiRef } from '@material-ui/x-grid';
import { interval } from 'rxjs';
import { randomInt, randomUserName } from '@material-ui/x-grid-data-generator';

const columns = [
  { field: 'id' },
  { field: 'username', width: 150 },
  { field: 'age', width: 80 },
];
const rows = [
  { id: 1, username: randomUserName(), age: randomInt(10, 80) },
  { id: 2, username: randomUserName(), age: randomInt(10, 80) },
  { id: 3, username: randomUserName(), age: randomInt(10, 80) },
  { id: 4, username: randomUserName(), age: randomInt(10, 80) },
];

export default function ApiRefRowsGrid() {
  const apiRef = useApiRef();

  React.useEffect(() => {
    const subscription = interval(200).subscribe(() => {
      apiRef.current.updateRowData([
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
      <XGrid rows={rows} columns={columns} apiRef={apiRef} />
    </div>
  );
}
