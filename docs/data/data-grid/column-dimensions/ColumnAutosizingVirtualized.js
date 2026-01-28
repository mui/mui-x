import * as React from 'react';
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';
import Button from '@mui/material/Button';

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

export default function ColumnAutosizingVirtualized() {
  const apiRef = useGridApiRef();
  const data = useData(100, 1000);

  return (
    <div style={{ width: '100%' }}>
      <Button
        onClick={() =>
          apiRef.current?.autosizeColumns({
            disableColumnVirtualization: true,
            includeHeaders: true,
          })
        }
      >
        Autosize Columns
      </Button>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid apiRef={apiRef} {...data} columnBufferPx={100} />
      </div>
    </div>
  );
}
