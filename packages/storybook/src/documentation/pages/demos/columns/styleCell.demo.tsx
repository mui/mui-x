import * as React from 'react';
import { Columns, RowsProp, XGrid } from '@material-ui/x-grid';
import '../demo.css';

export default function StyleCellDemo() {
  const columns: Columns = [
    {
      field: 'name',
      cellClass: 'super-app-theme--cell',
    },
    {
      field: 'score',
      type: 'number',
      cellClass: 'super-app',
      cellClassRules: {
        negative: ({ value }) => value! < 0,
        positive: ({ value }) => value! > 0,
      },
    },
  ];

  const rows: RowsProp = [
    {
      id: 1,
      name: 'Jane',
      score: 100,
    },
    {
      id: 2,
      name: 'Jack',
      score: -100,
    },
    {
      id: 3,
      name: 'Gill',
      score: -50,
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
