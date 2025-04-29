import * as React from 'react';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import { useGridApiRef, DataGrid } from '@mui/x-data-grid';
import { arSD } from '@mui/x-data-grid/locales';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';

// Create rtl cache
const cacheRtl = createCache({
  key: 'data-grid-rtl-demo',
  stylisPlugins: [prefixer, rtlPlugin],
});

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
    valueGetter: (value) => `${value} سنوات`,
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

export default function DataGridRTLVirtualization() {
  const apiRef = useGridApiRef();
  const existingTheme = useTheme();
  const theme = React.useMemo(
    () =>
      createTheme({}, arSD, existingTheme, {
        direction: 'rtl',
      }),
    [existingTheme],
  );
  React.useEffect(() => {
    Promise.resolve().then(() => {
      const scroller = apiRef.current.rootElementRef.current.querySelector(
        '.MuiDataGrid-virtualScroller',
      );
      scroller.scrollLeft = -Math.abs(scroller.scrollWidth - scroller.clientWidth);
    });
  }, [apiRef]);
  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <div dir="rtl" style={{ height: 400, width: 300 }}>
          <DataGrid apiRef={apiRef} rows={rows} columns={columns} />
        </div>
      </ThemeProvider>
    </CacheProvider>
  );
}
