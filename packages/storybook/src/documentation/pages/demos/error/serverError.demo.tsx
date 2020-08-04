import * as React from 'react';
import { Columns, useApiRef, XGrid } from '@material-ui/x-grid';

const columns: Columns = [
  { field: 'id', hide: true },
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
  const apiRef = useApiRef();
  const [isLoading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    setLoading(true);
    loadServerRows().catch((err) => {
      setLoading(false);
      apiRef.current!.showError({ message: err.message });
    });
  }, [apiRef, setLoading]);

  return (
    <XGrid
      rows={[]}
      columns={columns}
      options={{
        autoHeight: true,
      }}
      apiRef={apiRef}
      loading={isLoading}
    />
  );
}
