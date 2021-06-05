import * as React from 'react';
import { DataGrid, GridRowModel } from '@material-ui/data-grid';

const columns = [{ field: 'id', headerName: 'Id', width: 100 }];

export default function ConcurrentReactUpdate() {
  const [rows, setRows] = React.useState<GridRowModel[]>([]);

  React.useEffect(() => {
    setTimeout(() => setRows([]), 0);
    setTimeout(() => setRows([{ id: 1 }, { id: 2 }]), 1);
  }, []);

  return <DataGrid autoHeight columns={columns} rows={rows} />;
}
