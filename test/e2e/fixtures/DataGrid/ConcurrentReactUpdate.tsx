import * as React from 'react';
import { DataGrid, GridRowModel } from '@mui/x-data-grid';

const columns = [{ field: 'id', headerName: 'Id', width: 100 }];

export default function ConcurrentReactUpdate() {
  const [rows, setRows] = React.useState<GridRowModel[]>([]);

  React.useEffect(() => {
    const timer = setTimeout(() => setRows([{ id: 1 }, { id: 2 }]), 0);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return <DataGrid autoHeight columns={columns} rows={rows} />;
}
