import * as React from 'react';
import {
  DataGridPro,
  GridCellParams,
  GridColDef,
  GridDataSource,
  GridGetRowsParams,
} from '@mui/x-data-grid-pro';

function ThumbnailCell(props: GridCellParams) {
  if (!props.value) {
    return null;
  }
  const url = props.value as string;
  return (
    <img
      src={url}
      alt={props.row.product}
      style={{ width: 90, height: 90, padding: 5 }}
    />
  );
}

const columns: GridColDef[] = [
  {
    field: 'thumbnail',
    headerName: 'Preview',
    width: 120,
    renderCell: ThumbnailCell,
  },
  { field: 'title', headerName: 'Product', width: 200 },
  { field: 'description', headerName: 'Description', width: 200 },
  { field: 'brand', headerName: 'Brand', width: 150 },
  {
    field: 'price',
    type: 'number',
    headerName: 'Price',
    width: 80,
    valueFormatter: (value) => `$${value}`,
  },
];

const dataSource: GridDataSource = {
  getRows: async (params: GridGetRowsParams) => {
    const { pageSize, page } = params.paginationModel;
    const response = await fetch(
      `https://dummyjson.com/products?limit=${pageSize}&skip=${pageSize * page}`,
    );
    const data = await response.json();
    return {
      rows: data.products,
      rowCount: data.total,
    };
  },
};

export default function ServerSideDataGridDummyJson() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10 },
          },
        }}
        columns={columns}
        unstable_dataSource={dataSource}
        pagination
        pageSizeOptions={[10, 20, 50]}
        getRowHeight={() => 100}
        pinnedColumns={{ left: ['thumbnail'], right: ['price'] }}
        disableColumnSorting
        disableColumnFilter
      />
    </div>
  );
}
