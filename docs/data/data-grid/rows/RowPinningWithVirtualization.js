import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';

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

export default function RowPinningWithVirtualization() {
  const data = useData(100, 1000);

  console.log('data', data);

  if (!data.rows.length) {
    return null;
  }

  const [pinnedRow0, pinnedRow1, pinnedRow2, ...rows] = data.rows;

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        rows={rows}
        columnBuffer={2}
        columnThreshold={2}
        pinnedRows={{ top: [pinnedRow0, pinnedRow1], bottom: [pinnedRow2] }}
        pinnedColumns={{
          left: ['price1M', 'price67M'],
          right: ['price31M', 'price2M'],
        }}
      />
    </div>
  );
}
