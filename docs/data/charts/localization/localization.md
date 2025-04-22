---
title: Charts - Localization
productId: x-charts
components: ChartsLocalizationProvider, ChartsDataContainer, ChartsLocalizationProvider
---

# Charts - Localization

<p class="description">The Charts allows to support users from different locales, with formatting, and localized strings.</p>

The default locale of MUI X is English (United States). If you want to use other locales, follow the instructions below.

## Translation keys

You can use the `localeText` prop to pass in your own text and translations.
You can find all the translation keys supported in [the source](https://github.com/mui/mui-x/blob/-/packages/x-charts/src/locales/enUS.ts)
in the GitHub repository.
In the following example, the labels of the loading overlay are customized.

{{"demo": "CustomLocaleOverlay.js", "bg": "inline"}}

## Locale text

You can use the theme to configure the locale text:

```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BarChart } from '@mui/x-charts/BarChart';
import { frFR } from '@mui/x-charts/locales';
// Or import { frFR } from '@mui/x-charts-pro/locales';

const theme = createTheme(
  {
    palette: {
      primary: { main: '#1976d2' },
    },
  },
  frFR,
);

<ThemeProvider theme={theme}>
  <BarChart />
</ThemeProvider>;
```

Note that `createTheme()` accepts any number of arguments.
If you are already using the [translations of the core components](/material-ui/guides/localization/#locale-text), you can add `frFR` as a new argument.
The same import works for Charts Pro as it's an extension of Charts.

```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BarChart } from '@mui/x-charts/BarChart';
import { frFR } from '@mui/x-charts/locales';
import { frFR as dataGridFrFR } from '@mui/x-date-pickers/locales';
import { frFR as pickersFrFR } from '@mui/x-date-pickers/locales';
import { frFR as coreFrFR } from '@mui/material/locale';

const theme = createTheme(
  {
    palette: {
      primary: { main: '#1976d2' },
    },
  },
  frFR, // x-charts translations
  dataGridFrFR, // x-data-grid translations
  pickersFrFR, // x-date-pickers translations
  coreFrFR, // core translations
);

<ThemeProvider theme={theme}>
  <BarChart />
</ThemeProvider>;
```

If you want to pass language translations directly to the Data Grid without using `createTheme()` and `ThemeProvider`, you can directly load the language translations from `@mui/x-data-grid/locales`.

```jsx
import { BarChart } from '@mui/x-charts';
import { nlNL } from '@mui/x-charts/locales';

<BarChart
  localeText={nlNL.components.MuiChartsLocalizationProvider.defaultProps.localeText}
/>;
```

### Using ChartsLocalizationProvider

If you want to pass language translations without using `createTheme()` and `ThemeProvider`,
you can directly load the language translations from the `@mui/x-charts` or `@mui/x-charts-pro` package and pass them to the `ChartsLocalizationProvider`.

```jsx
import { ChartsLocalizationProvider } from '@mui/x-date-pickers/ChartsLocalizationProvider';
import { deDE } from '@mui/x-date-pickers/locales';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

<ChartsLocalizationProvider
  localeText={deDE.components.MuiChartsLocalizationProvider.defaultProps.localeText}
>
  <DatePicker />
</ChartsLocalizationProvider>;
```

### Supported locales

{{"demo": "ChartsLocalizationTableNoSnap.js", "hideToolbar": true, "bg": "inline"}}

You can [find the source](https://github.com/mui/mui-x/tree/HEAD/packages/x-charts/src/locales) in the GitHub repository.

To create your own translation or to customize the English text, copy this file to your project, make any changes needed and import the locale from there.
Note that these translations of charts component depend on the [Localization strategy](/material-ui/guides/localization/) of the whole library.

## RTL Support

Right-to-left languages such as Arabic, Persian, or Hebrew are supported.
Follow [this guide](/material-ui/customization/right-to-left/) to use them.
