import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';

function getRowsFromServer(commodityFilterValue) {
  const serverRows = [
    { id: '1', commodity: 'rice' },
    { id: '2', commodity: 'soybeans' },
    { id: '3', commodity: 'milk' },
    { id: '4', commodity: 'wheat' },
    { id: '5', commodity: 'oats' },
  ];

  return new Promise((resolve) => {
    setTimeout(() => {
      if (!commodityFilterValue) {
        resolve(serverRows);
      }
      resolve(
        serverRows.filter(
          (row) => row.commodity.toLowerCase().indexOf(commodityFilterValue) > -1,
        ),
      );
    }, 500);
  });
}
export default function ServerFilterGrid() {
  const [columns] = React.useState([{ field: 'commodity', width: 150 }]);
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const fetchRows = React.useCallback(async (filterValue) => {
    setLoading(true);
    const serverRows = await getRowsFromServer(filterValue);
    setRows(serverRows);
    setLoading(false);
  }, []);

  const onFilterChange = React.useCallback(
    async (params) => {
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
