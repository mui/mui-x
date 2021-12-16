import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function PageControlled() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  const [page, setPage] = React.useState(0);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        page={page}
        onPageChange={(newPage) => setPage(newPage)}
        pageSize={5}
        rowsPerPageOptions={[5]}
        pagination
        {...data}
      />
    </div>
  );
}
