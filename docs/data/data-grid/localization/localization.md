# Data Grid - Localization

<p class="description">The data grid allows to support users from different locales, with formatting, and localized strings.</p>

The default locale of MUI is English (United States). If you want to use other locales, follow the instructions below.

## Translation keys

<!-- #default-branch-switch -->

You can use the `localeText` prop to pass in your own text and translations.
You can find all the translation keys supported in [the source](https://github.com/mui/mui-x/blob/HEAD/packages/grid/x-data-grid/src/constants/localeTextConstants.ts)
in the GitHub repository.
In the following example, the labels of the density selector are customized.

{{"demo": "CustomLocaleTextGrid.js", "bg": "inline"}}

:::warning
It's important to note that because the data grid uses components from the Material UI library some translation keys need to be accessed using that component key.

One example is the table pagination component used in the data grid footer when pagination is enabled. All the keys provided to the `MuiTablePagination` object are applied as props directly to the [`TablePagination`](/material-ui/api/table-pagination/) component.

```jsx
<DataGrid
  {...data}
  localeText={{
    MuiTablePagination: {
      labelDisplayedRows: ({ from, to, count }) =>
        `${from} - ${to} of more than ${count}`,
    },
  }}
/>
```

:::

## Locale text

The default locale of MUI is English (United States).

You can use the theme to configure the locale text:

```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DataGrid, bgBG } from '@mui/x-data-grid';

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

Note that `createTheme` accepts any number of arguments.
If you are already using the [translations of the core components](/material-ui/guides/localization/#locale-text), you can add `bgBG` as a new argument.
The same import works for `DataGridPro` as it's an extension of `DataGrid`.

```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DataGrid, bgBG } from '@mui/x-data-grid';
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

If you want to pass language translations directly to the data grid without using `createTheme` and `ThemeProvider`, you can directly load the language translations from the `@mui/x-data-grid` or `@mui/x-data-grid-pro` package.

```jsx
import { DataGrid, nlNL } from '@mui/x-data-grid';

<DataGrid localeText={nlNL.components.MuiDataGrid.defaultProps.localeText} />;
```

### Supported locales

{{"demo": "DataGridLocalisationTableNoSnap.js", "hideToolbar": true, "bg": "inline"}}

You can [find the source](https://github.com/mui/mui-x/tree/HEAD/packages/grid/x-data-grid/src/locales) in the GitHub repository.

To create your own translation or to customize the English text, copy this file to your project, make any changes needed and import the locale from there.
Note that these translations of the Data Grid component depend on the [Localization strategy](/material-ui/guides/localization/) of the whole library.

## RTL Support 🚧

:::warning
RTL is not fully supported in the Data Grid.

👍 Upvote [issue #230](https://github.com/mui/mui-x/issues/230) if that's a requirement in your project.
:::

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
