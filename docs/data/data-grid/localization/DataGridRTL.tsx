import * as React from 'react';
import { DataGrid, GridColDef, arSD } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme(
  {
    direction: 'rtl',
    palette: {
      primary: { main: '#1976d2' },
    },
  },
  arSD,
);

const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'بطاقة تعريف',
    width: 150,
  },
  {
    field: 'name',
    headerName: 'اسم',
    width: 150,
  },
  {
    field: 'age',
    headerName: 'عمر',
    valueGetter: (params) => `${params.value} سنوات`,
    width: 150,
  },
  {
    field: 'occupation',
    headerName: 'المهنة',
    width: 150,
  },
  {
    field: 'gender',
    headerName: 'جنس',
    width: 150,
  },
];

const rows = [
  { id: 1, name: 'سارہ', age: 35, occupation: 'معلم', gender: 'أنثى' },
  { id: 2, name: 'زید', age: 42, occupation: 'مهندس', gender: 'ذكر' },
  { id: 3, name: 'علی', age: 33, occupation: 'محاسب', gender: 'ذكر' },
  { id: 4, name: 'فاطمہ', age: 25, occupation: 'معلم', gender: 'أنثى' },
  { id: 5, name: 'ایندریو', age: 65, occupation: 'مهندس', gender: 'ذكر' },
];

export default function DataGridRTL() {
  return (
    <ThemeProvider theme={theme}>
      <div dir="rtl" style={{ height: 400, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} />
      </div>
    </ThemeProvider>
  );
}
