import * as React from 'react';
import { XGrid } from '@material-ui/x-grid';

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

    const columns = [{ field: 'id', hide: true }];

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
  const data = useData(500, 1000);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <XGrid {...data} columnBuffer={2} hideFooter />
    </div>
  );
}
