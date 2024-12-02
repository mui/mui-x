import * as React from 'react';
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid';

export interface DataRowModel {
  id: GridRowId;
  [price: string]: number | string;
}

export interface GridData {
  columns: GridColDef[];
  rows: DataRowModel[];
}

function useData(rowLength: number, columnLength: number) {
  const [data, setData] = React.useState<GridData>({ columns: [], rows: [] });

  React.useEffect(() => {
    const rows: DataRowModel[] = [];

    for (let i = 0; i < rowLength; i += 1) {
      const row: DataRowModel = {
        id: i,
      };

      for (let j = 1; j <= columnLength; j += 1) {
        row[`price${j}M`] = `${i.toString()}, ${j} `;
      }

      rows.push(row);
    }

    const columns: GridColDef[] = [];

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
