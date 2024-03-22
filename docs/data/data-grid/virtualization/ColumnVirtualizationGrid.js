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
      columns.push({ field: `price${j}M`, headerName: `${j}M` });
    }

    setData({
      rows,
      columns,
    });
  }, [rowLength, columnLength]);

  return data;
}

export default function ColumnVirtualizationGrid() {
  const data = useData(100, 1000);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid {...data} columnBufferPx={100} />
    </div>
  );
}
