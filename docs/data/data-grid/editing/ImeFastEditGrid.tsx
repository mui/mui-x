import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';

export default function ImeFastEditGrid() {
  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        experimentalFeatures={{ imeFastEdit: true }}
      />
    </div>
  );
}

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 180, editable: true },
  { field: 'city', headerName: 'City', width: 180, editable: true },
  { field: 'country', headerName: 'Country', width: 180, editable: true },
];

const rows: GridRowsProp = [
  { id: 1, name: '김민준', city: '서울', country: '대한민국' },
  { id: 2, name: '佐藤 陽菜', city: '東京', country: '日本' },
  { id: 3, name: '王伟', city: '北京', country: '中国' },
  { id: 4, name: 'Nguyễn Văn An', city: 'Hà Nội', country: 'Việt Nam' },
  { id: 5, name: 'Ana Souza', city: 'São Paulo', country: 'Brasil' },
];
