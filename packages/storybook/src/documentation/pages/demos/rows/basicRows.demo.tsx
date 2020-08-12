import * as React from 'react';
import { Columns, RowsProp, XGrid } from '@material-ui/x-grid';
import '../demo.css';

export default function BasicRowsDemo() {
  const columns: Columns = [{ field: 'id', hide: true }, { field: 'name' }];

  const rows: RowsProp = [
    {
      id: 1,
      name: 'XGrid',
    },
    {
      id: 2,
      name: 'DataGrid',
    },
    {
      id: 3,
      name: 'DataTable',
    },
  ];

  return <XGrid rows={rows} columns={columns} className="demo" autoHeight />;
}
