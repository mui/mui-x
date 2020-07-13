import { gridApiRef, XGrid } from '@material-ui/x-grid';
import { useEffect } from 'react';
import { interval } from 'rxjs';
import { randomInt, randomUserName } from '@material-ui/x-grid-data-generator';
import * as React from 'react';

export default function UpdateRows() {
  const api = gridApiRef();
  const columns = [{ field: 'id' }, { field: 'username', width: 150 }, { field: 'age', width: 80 }];
  const rows = [
    { id: 1, username: randomUserName(), age: randomInt(10, 80) },
    { id: 2, username: randomUserName(), age: randomInt(10, 80) },
    { id: 3, username: randomUserName(), age: randomInt(10, 80) },
    { id: 4, username: randomUserName(), age: randomInt(10, 80) },
  ];
  useEffect(() => {
    const subscription = interval(100).subscribe(obs =>
      api.current?.updateRowData([
        { id: randomInt(1, 4), username: randomUserName(), age: randomInt(10, 80) },
        { id: randomInt(1, 4), username: randomUserName(), age: randomInt(10, 80) },
      ]),
    );

    return () => subscription.unsubscribe();
  }, [api]);

  return <XGrid rows={rows} columns={columns} apiRef={api} options={{ autoHeight: true }} />;
}
