import * as React from 'react';
import {
  GridColDef,
  DataGrid,
  GridRowModel,
  GridFilterModel,
} from '@material-ui/data-grid';

function loadServerRows(commodityFilterValue?: string): Promise<any> {
  const serverRows = [
    { id: '1', commodity: 'rice' },
    { id: '2', commodity: 'soybeans' },
    { id: '3', commodity: 'milk' },
    { id: '4', commodity: 'wheat' },
    { id: '5', commodity: 'oats' },
  ];

  return new Promise<any>((resolve) => {
    setTimeout(() => {
      if (!commodityFilterValue) {
        resolve(serverRows);
        return;
      }
      resolve(
        serverRows.filter(
          (row) => row.commodity.toLowerCase().indexOf(commodityFilterValue!) > -1,
        ),
      );
    }, Math.random() * 500 + 100); // simulate network latency
  });
}

export default function ServerFilterGrid() {
  const [columns] = React.useState<GridColDef[]>([
    { field: 'commodity', width: 150 },
  ]);
  const [rows, setRows] = React.useState<GridRowModel[]>([]);
  const [filterValue, setFilterValue] = React.useState<string | undefined>();
  const [loading, setLoading] = React.useState(false);

  const onFilterChange = React.useCallback((filterModel: GridFilterModel) => {
    setFilterValue(filterModel.items[0].value);
  }, []);

  React.useEffect(() => {
    let active = true;

    (async () => {
      setLoading(true);
      const newRows = await loadServerRows(filterValue);

      if (!active) {
        return;
      }

      setRows(newRows);
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [filterValue]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        filterMode="server"
        onFilterModelChange={onFilterChange}
        loading={loading}
      />
    </div>
  );
}
