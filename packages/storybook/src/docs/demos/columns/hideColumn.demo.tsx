import * as React from 'react';
import { Columns, RowsProp, XGrid } from '@material-ui/x-grid';
import { randomCreatedDate, randomUpdatedDate } from '@material-ui/x-grid-data-generator';
import Button from '@material-ui/core/Button';

export default function HideColumnDemo() {
  const [columns, setColumns] = React.useState<Columns>([
    { field: 'id', hide: true },
    { field: 'name', type: 'string' },
    { field: 'age', type: 'number' },
    { field: 'dateCreated', type: 'date', width: 180 },
    { field: 'lastLogin', type: 'dateTime', width: 180 },
  ]);

  const rows: RowsProp = React.useMemo(
    () => [
      {
        id: 1,
        name: 'Damien',
        age: 25,
        dateCreated: randomCreatedDate(),
        lastLogin: randomUpdatedDate(),
      },
      {
        id: 2,
        name: 'Nicolas',
        age: 36,
        dateCreated: randomCreatedDate(),
        lastLogin: randomUpdatedDate(),
      },
      {
        id: 3,
        name: 'Kate',
        age: 19,
        dateCreated: randomCreatedDate(),
        lastLogin: randomUpdatedDate(),
      },
      {
        id: 4,
        name: 'Sebastien',
        age: 28,
        dateCreated: randomCreatedDate(),
        lastLogin: randomUpdatedDate(),
      },
      {
        id: 5,
        name: 'Louise',
        age: 23,
        dateCreated: randomCreatedDate(),
        lastLogin: randomUpdatedDate(),
      },
    ],
    [],
  );

  const toggleLastLogin = React.useCallback(() => {
    setColumns(cols =>
      cols.map(col => {
        if (col.field === 'lastLogin') {
          col.hide = !col.hide;
        }
        return col;
      }),
    );
  }, [setColumns]);

  return (
    <React.Fragment>
      <Button onClick={toggleLastLogin} color={'primary'} variant={'contained'} size={'small'}>
        Toggle Last Login Column
      </Button>
      <div style={{ width: 800, height: 320, padding: '10px 0' }}>
        <XGrid
          rows={rows}
          columns={columns}
          options={{ hideFooter: true, autoHeight: true }}
          className={'demo'}
        />
      </div>
    </React.Fragment>
  );
}
