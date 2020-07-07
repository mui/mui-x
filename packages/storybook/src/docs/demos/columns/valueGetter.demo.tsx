import * as React from 'react';
import { Columns, RowsProp, XGrid } from '@material-ui/x-grid';
import '../demo.css';

export default function ValueGetterDemo() {
  const columns: Columns = [
    { field: 'firstName' },
    { field: 'lastName' },
    {
      field: 'fullName',
      width: 200,
      valueGetter: ({ data }) => `${data.firstName} ${data.lastName}`,
    },
  ];

  const rows: RowsProp = [
    {
      id: 1,
      firstName: 'Paul',
      lastName: 'Kenton',
    },
    {
      id: 2,
      firstName: 'Jack',
      lastName: 'Kilby',
    },
    {
      id: 3,
      firstName: 'John',
      lastName: 'Napier',
    },
  ];

  return <XGrid rows={rows} columns={columns} options={{ hideFooter: true, autoHeight: true }} />;
}
