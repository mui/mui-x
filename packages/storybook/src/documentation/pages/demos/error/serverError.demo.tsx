import * as React from 'react';
import { GridColumns, useGridApiRef, XGrid } from '@mui/x-data-grid-pro';

const columns: GridColumns = [
  { field: 'name', type: 'string' },
  { field: 'email', type: 'string' },
  { field: 'age', type: 'number' },
  { field: 'dateCreated', type: 'date', width: 180 },
  { field: 'lastLogin', type: 'dateTime', width: 180 },
];

function loadServerRows(): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('Error loading rows.'));
    }, 800);
  });
}

export default function ServerErrorDemo() {
  const apiRef = useGridApiRef();
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    setLoading(true);
    loadServerRows().catch((err) => {
      setLoading(false);
      apiRef.current.showError({ message: err.message });
    });
  }, [apiRef, setLoading]);

  return <XGrid rows={[]} columns={columns} autoHeight apiRef={apiRef} loading={loading} />;
}
