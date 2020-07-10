import * as React from 'react';
import { Columns, RowsProp, XGrid } from '@material-ui/x-grid';
import '../demo.css';

export default function StyleHeaderDemo() {
  const columns: Columns = [
    {
      field: 'first',
      headerClass: 'super-app-theme--header',
      headerAlign: 'center',
    },
    {
      field: 'last',
      headerClass: 'super-app-theme--header',
      headerAlign: 'center',
    },
  ];

  const rows: RowsProp = [
    {
      id: 1,
      first: 'Jane',
      last: 'Carter',
    },
    {
      id: 2,
      first: 'Jack',
      last: 'Smith',
    },
    {
      id: 3,
      first: 'Gill',
      last: 'Martin',
    },
  ];

  return (
    <XGrid
      rows={rows}
      columns={columns}
      options={{ hideFooter: true, autoHeight: true }}
      className={'demo'}
    />
  );
}
