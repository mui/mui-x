import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'name', headerName: 'Product', width: 180, rowHeader: true },
  { field: 'category', headerName: 'Category', width: 140 },
  { field: 'price', headerName: 'Price', type: 'number', width: 100 },
];

const rows = [
  { id: 1, name: 'Desk lamp', category: 'Lighting', price: 39 },
  { id: 2, name: 'Office chair', category: 'Furniture', price: 249 },
  { id: 3, name: 'Notebook', category: 'Stationery', price: 8 },
];

export default function RowHeaderGrid() {
  return (
    <div style={{ height: 250, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} hideFooter />
    </div>
  );
}
