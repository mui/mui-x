import * as React from 'react';
import { DataGrid, arSD } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

const columns = [
  {
    field: 'id',
    headerName: 'تعريف',
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

// Create rtl cache
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

const theme = createTheme(
  {
    direction: 'rtl', // Both here and <body dir="rtl">
  },
  arSD,
);

export default function DataGridRTL() {
  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <div dir="rtl" style={{ height: 400, width: '100%' }}>
          <DataGrid rows={rows} columns={columns} />
        </div>
      </ThemeProvider>
    </CacheProvider>
  );
}
