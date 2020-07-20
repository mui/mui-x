import * as React from 'react';
import { useApiRef, XGrid } from '@material-ui/x-grid';
import { interval } from 'rxjs';
import { randomInt, randomUserName } from '@material-ui/x-grid-data-generator';

export default function UpdateRows() {
  const apiRef = useApiRef();
  const columns = [{ field: 'id' }, { field: 'username', width: 150 }, { field: 'age', width: 80 }];
  const rows = [
    { id: 1, username: randomUserName(), age: randomInt(10, 80) },
    { id: 2, username: randomUserName(), age: randomInt(10, 80) },
    { id: 3, username: randomUserName(), age: randomInt(10, 80) },
    { id: 4, username: randomUserName(), age: randomInt(10, 80) },
  ];
  React.useEffect(() => {
    const subscription = interval(100).subscribe(() =>
      apiRef.current?.updateRowData([
        { id: randomInt(1, 4), username: randomUserName(), age: randomInt(10, 80) },
        { id: randomInt(1, 4), username: randomUserName(), age: randomInt(10, 80) },
      ]),
    );

    return () => subscription.unsubscribe();
  }, [apiRef]);

  return <XGrid rows={rows} columns={columns} apiRef={apiRef} options={{ autoHeight: true }} />;
}
