import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const baselineProps = {
  rows: [
    {
      id: 0,
      brand: 'Nike',
    },
    {
      id: 1,
      brand: 'Adidas',
    },
    {
      id: 2,
      brand: 'Puma',
    },
  ],
  columns: [{ field: 'brand', width: 100 }],
};

export default function Pagination() {
  return (
    <div style={{ width: 300, height: 300 }}>
      <DataGrid
        {...baselineProps}
        pageSizeOptions={[1]}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 1 },
          },
        }}
        checkboxSelection
      />
    </div>
  );
}
