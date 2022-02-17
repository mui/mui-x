import * as React from 'react';
import { DataGrid, getGridStringOperators } from '@mui/x-data-grid';

function loadServerRows(commodityFilterValue) {
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
        return;
      }
      resolve(
        serverRows.filter((row) =>
          row.commodity.toLowerCase().includes(commodityFilterValue),
        ),
      );
    }, Math.random() * 500 + 100); // simulate network latency
  });
}

const columns = [
  {
    field: 'commodity',
    width: 150,
    filterOperators: getGridStringOperators().filter(
      (operator) => operator.value === 'contains',
    ),
  },
];

export default function ServerFilterGrid() {
  const [rows, setRows] = React.useState([]);
  const [filterValue, setFilterValue] = React.useState();
  const [loading, setLoading] = React.useState(false);

  const onFilterChange = React.useCallback((filterModel) => {
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
