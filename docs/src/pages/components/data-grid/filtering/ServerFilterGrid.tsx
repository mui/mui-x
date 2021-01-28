import {
  ColDef,
  DataGrid,
  FilterModelParams,
  RowModel,
} from '@material-ui/data-grid';
import * as React from 'react';

function getRowsFromServer(commodityFilterValue?: string) {
  const serverRows = [
    { id: '1', commodity: 'rice' },
    { id: '2', commodity: 'soybeans' },
    { id: '3', commodity: 'milk' },
    { id: '4', commodity: 'wheat' },
    { id: '5', commodity: 'oats' },
  ];

  return new Promise<RowModel[]>((resolve) => {
    setTimeout(() => {
      if (!commodityFilterValue) {
        resolve(serverRows);
      }
      resolve(
        serverRows.filter(
          (row) => row.commodity.toLowerCase().indexOf(commodityFilterValue!) > -1,
        ),
      );
    }, 500);
  });
}
export default function ServerFilterGrid() {
  const [columns] = React.useState<ColDef[]>([{ field: 'commodity', width: 150 }]);
  const [rows, setRows] = React.useState<RowModel[]>([]);
  const [loading, setLoading] = React.useState(false);

  const fetchRows = React.useCallback(async (filterValue?: string) => {
    setLoading(true);
    const serverRows = await getRowsFromServer(filterValue);
    setRows(serverRows);
    setLoading(false);
  }, []);

  const onFilterChange = React.useCallback(
    async (params: FilterModelParams) => {
      await fetchRows(params.filterModel.items[0].value);
    },
    [fetchRows],
  );

  React.useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        filterMode={'server'}
        onFilterModelChange={onFilterChange}
        loading={loading}
      />
    </div>
  );
}
