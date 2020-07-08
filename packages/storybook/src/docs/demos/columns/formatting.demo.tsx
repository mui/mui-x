import * as React from 'react';
import { CellValue, Columns, RowsProp, XGrid } from '@material-ui/x-grid';
import '../demo.css';

export default function FormattingDemo() {
  const columns: Columns = [
    {
      field: 'date',
      headerName: 'Year',
      valueFormatter: ({ value }: { value: CellValue }) => (value as Date).getFullYear(),
    },
  ];

  const rows: RowsProp = [
    {
      id: 1,
      date: new Date(1979, 0, 1),
    },
    {
      id: 2,
      date: new Date(1984, 1, 1),
    },
    {
      id: 3,
      date: new Date(1992, 2, 1),
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
