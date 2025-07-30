# Data Grid - Localization

The Data Grid's localization features provide the appropriate translations and formatting for users around the world.

The default locale of MUI X is English (United States).
To use other locales, follow the instructions below.

## Translation keys

You can use the `localeText` prop to pass in your own text and translations.
You can find all the translation keys supported in [the source](https://github.com/mui/mui-x/blob/-/packages/x-data-grid/src/constants/localeTextConstants.ts)
in the GitHub repository.
In the following example, the label of the quick filter placeholder is customized.

```tsx
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function CustomLocaleTextGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 4,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        localeText={{
          toolbarQuickFilterPlaceholder: 'Search commodities',
        }}
        showToolbar
      />
    </div>
  );
}

```

:::warning
It's important to note that because the Data Grid uses components from the Material UI library, some translation keys need to be accessed using that component key.

One example is the table pagination component used in the Data Grid footer when pagination is enabled. All the keys provided to the `MuiTablePagination` object are applied as props directly to the [Table Pagination](/material-ui/api/table-pagination/) component.

```jsx
<DataGrid
  {...data}
  localeText={{
    MuiTablePagination: {
      labelDisplayedRows: ({ from, to, count }) =>
        `${from} - ${to} of ${count === -1 ? `more than ${to}` : count}`,
    },
  }}
/>
```

:::

## Locale text

The default locale of MUI X is English (United States).

You can use the theme to configure the locale text:

```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { bgBG } from '@mui/x-data-grid/locales';
// Or import { bgBG } from '@mui/x-data-grid-pro/locales';
// Or import { bgBG } from '@mui/x-data-grid-premium/locales';

const theme = createTheme(
  {
    palette: {
      primary: { main: '#1976d2' },
    },
  },
  bgBG,
);

<ThemeProvider theme={theme}>
  <DataGrid />
</ThemeProvider>;
```

Note that `createTheme()` accepts any number of arguments.
If you are already using the [translations of the core components](/material-ui/guides/localization/#locale-text), you can add `bgBG` as a new argument.
The same import works for Data Grid Pro as it's an extension of Data Grid.

```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { bgBG } from '@mui/x-data-grid/locales';
import { bgBG as pickersBgBG } from '@mui/x-date-pickers/locales';
import { bgBG as coreBgBG } from '@mui/material/locale';

const theme = createTheme(
  {
    palette: {
      primary: { main: '#1976d2' },
    },
  },
  bgBG, // x-data-grid translations
  pickersBgBG, // x-date-pickers translations
  coreBgBG, // core translations
);

<ThemeProvider theme={theme}>
  <DataGrid />
</ThemeProvider>;
```

If you want to pass language translations directly to the Data Grid without using `createTheme()` and `ThemeProvider`, you can directly load the language translations from `@mui/x-data-grid/locales`.

```jsx
import { DataGrid } from '@mui/x-data-grid';
import { nlNL } from '@mui/x-data-grid/locales';

<DataGrid localeText={nlNL.components.MuiDataGrid.defaultProps.localeText} />;
```

### Supported locales

```jsx
import * as React from 'react';
import LocalisationTable from 'docsx/src/modules/components/LocalizationTable';
import data from './data.json';

export default function DataGridLocalisationTableNoSnap() {
  return <LocalisationTable data={data} />;
}

```

You can [find the source](https://github.com/mui/mui-x/tree/HEAD/packages/x-data-grid/src/locales) in the GitHub repository.

To create your own translation or to customize the English text, copy this file to your project, make any changes needed and import the locale from there.
Note that these translations of the Data Grid component depend on the [Localization strategy](/material-ui/guides/localization/) of the whole library.

## RTL Support

Right-to-left languages such as Arabic, Persian, or Hebrew are supported.
Follow [this guide](/material-ui/customization/right-to-left/) to use them.

The example below demonstrates how to use an RTL language (Arabic) with the Data Grid.

```tsx
import * as React from 'react';
import { prefixer } from 'stylis';
import rtlPlugin from '@mui/stylis-plugin-rtl';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { arSD } from '@mui/x-data-grid/locales';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';

// Create rtl cache
const cacheRtl = createCache({
  key: 'data-grid-rtl-demo',
  stylisPlugins: [prefixer, rtlPlugin],
});

const columns: GridColDef[] = [
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

export default function DataGridRTL() {
  // Inherit the theme from the docs site (dark/light mode)
  const existingTheme = useTheme();

  const theme = React.useMemo(
    () =>
      createTheme({}, arSD, existingTheme, {
        direction: 'rtl',
      }),
    [existingTheme],
  );
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

```

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
