# Data Grid - Localization

<p class="description">The Data Grid's localization features provide the appropriate translations and formatting for users around the world.</p>

The default locale of MUI X is English (United States).
To use other locales, follow the instructions below.

## Translation keys

You can use the `localeText` prop to pass in your own text and translations.
You can find all the translation keys supported in [the source](https://github.com/mui/mui-x/blob/-/packages/x-data-grid/src/constants/localeTextConstants.ts)
in the GitHub repository.
In the following example, the label of the quick filter placeholder is customized.

{{"demo": "CustomLocaleTextGrid.js", "bg": "inline"}}

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

{{"demo": "DataGridLocalisationTableNoSnap.js", "hideToolbar": true, "bg": "inline"}}

You can [find the source](https://github.com/mui/mui-x/tree/HEAD/packages/x-data-grid/src/locales) in the GitHub repository.

To create your own translation or to customize the English text, copy this file to your project, make any changes needed and import the locale from there.
Note that these translations of the Data Grid component depend on the [Localization strategy](/material-ui/guides/localization/) of the whole library.

## RTL Support

Right-to-left languages such as Arabic, Persian, or Hebrew are supported.
Follow [this guide](/material-ui/customization/right-to-left/) to use them.

The example below demonstrates how to use an RTL language (Arabic) with the Data Grid.

{{"demo": "DataGridRTL.js", "bg": "inline"}}

## Pagination number formatting

To format large numbers in the pagination component, customize the `paginationDisplayedRows` with the following code:

```jsx
import { DataGridPro } from '@mui/x-data-grid-pro';

// ======================================================
// TODO: replace with your locale
import { enUS as locale } from '@mui/x-data-grid/locales';
const LOCALE = 'en-US';
// ======================================================

const formatNumber = (value: number | string): string => {
  if (typeof Intl !== 'undefined' && Intl.NumberFormat) {
    try {
      const result = new Intl.NumberFormat(LOCALE).format(Number(value));
      return result === 'NaN' ? value : result;
    } catch {
      return value;
    }
  }
  return value;
};

const paginationDisplayedRows = ({
  from,
  to,
  count,
  estimated,
}: {
  from: number;
  to: number;
  count: number;
  page: number;
  estimated?: number;
}) => {
  if (!estimated) {
    return `${formatNumber(from)}–${formatNumber(to)} sur ${
      count !== -1 ? formatNumber(count) : `plus de ${formatNumber(to)}`
    }`;
  }
  const estimatedLabel =
    estimated && estimated > to
      ? `environ ${formatNumber(estimated)}`
      : `plus de ${formatNumber(to)}`;
  return `${formatNumber(from)}–${formatNumber(to)} sur ${
    count !== -1 ? formatNumber(count) : estimatedLabel
  }`;
};

locale.components.MuiDataGrid.defaultProps.localeText.paginationDisplayedRows =
  paginationDisplayedRows;

<DataGridPro
  localeText={locale.components.MuiDataGrid.defaultProps.localeText}
/>
```

{{"demo": "PaginationNumberFormatting.js", "bg": "inline"}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
