import * as React from 'react';
import { ColDef, RowsProp, SortDirection, XGrid, SortModelParams } from '@material-ui/x-grid';

const getColumns: () => ColDef[] = () => [
  { field: 'id', type: 'number' },
  { field: 'name', type: 'string' },
  { field: 'age', type: 'number', width: 100 },
  { field: 'born', type: 'date' },
  { field: 'updatedOn', type: 'dateTime', width: 180 },
];

const getRows = () => [
  {
    id: 1,
    name: 'Zelda',
    age: 21,
    born: new Date(1990, 10, 8),
    updatedOn: new Date(2020, 6, 21, 21, 0, 0),
  },
  {
    id: 2,
    name: 'Anakin',
    age: 30,
    born: new Date(1990, 9, 8),
    updatedOn: new Date(2020, 6, 21, 20, 0, 0),
  },
  {
    id: 3,
    name: 'James',
    age: 40,
    born: new Date(1990, 10, 7),
    updatedOn: new Date(2020, 6, 21, 19, 50, 0),
  },
  {
    id: 4,
    name: 'Chun',
    age: 40,
    born: new Date(1989, 1, 30),
    updatedOn: new Date(2020, 5, 18, 10, 11, 0),
  },
  {
    id: 5,
    name: 'Leila',
    age: null,
    born: new Date(1984, 6, 11),
    updatedOn: new Date(2020, 6, 8, 23, 33, 25),
  },
];

function sortServerRows(rows: any[], params: SortModelParams): Promise<any[]> {
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      if (params.sortModel.length === 0) {
        resolve(getRows());
      }
      const sortedCol = params.sortModel[0];
      const comparator = params.columns.filter((col: ColDef) => col.field === sortedCol.field)[0]
        .sortComparator!;
      let sortedRows = [
        ...rows.sort((a, b) => comparator(a[sortedCol.field], b[sortedCol.field], a, b)),
      ];

      if (params.sortModel[0].sort === 'desc') {
        sortedRows = sortedRows.reverse();
      }

      resolve(sortedRows);
    }, 500);
  });
}

export default function ServerSortingDemo() {
  const [rows, setRows] = React.useState<RowsProp>(getRows());
  const columns = React.useRef<ColDef[]>(getColumns());
  const [loading, setLoading] = React.useState<boolean>(false);

  const onSortModelChange = React.useCallback(
    async (params: SortModelParams) => {
      setLoading(true);

      const newRows = await sortServerRows(rows, params);
      setRows(newRows);
      setLoading(false);
    },
    [setLoading, rows, setRows],
  );

  const sortBy = React.useMemo(() => [{ field: 'age', sort: 'desc' as SortDirection }], []);

  return (
    <XGrid
      rows={rows}
      columns={columns.current}
      onSortModelChange={onSortModelChange}
      sortingMode="server"
      disableMultipleColumnsSorting
      sortModel={sortBy}
      autoHeight
      loading={loading}
      className="demo"
    />
  );
}
