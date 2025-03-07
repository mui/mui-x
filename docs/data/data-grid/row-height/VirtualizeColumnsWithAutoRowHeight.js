import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

function useData(rowLength, columnLength) {
  const [data, setData] = React.useState({ columns: [], rows: [] });

  React.useEffect(() => {
    const rows = [];

    for (let i = 0; i < rowLength; i += 1) {
      const row = {
        id: i,
      };

      for (let j = 1; j <= columnLength; j += 1) {
        row[`price${j}M`] = `${i.toString()}, ${j} `;
      }

      rows.push(row);
    }

    const columns = [];

    for (let j = 1; j <= columnLength; j += 1) {
      columns.push({ field: `price${j}M`, headerName: `${j}M`, width: 55 });
    }

    setData({
      rows,
      columns,
    });
  }, [rowLength, columnLength]);

  return data;
}

export default function VirtualizeColumnsWithAutoRowHeight() {
  const data = useData(100, 100);

  return (
    <div style={{ height: 600, width: '100%' }}>
      <DataGrid
        {...data}
        getRowHeight={() => 'auto'}
        virtualizeColumnsWithAutoRowHeight
      />
    </div>
  );
}
