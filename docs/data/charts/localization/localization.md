---
title: Charts - Localization
productId: x-charts
components: ChartsLocalizationProvider, ChartDataProvider, ChartsContainer
---

# Charts - Localization

<p class="description">Adapt charts to different languages and locales.</p>

The default locale for MUI X Charts is English (United States).
This page describes how to use other locales, including how to set translations [locally](#set-translations-locally) and [globally](#set-translations-globally), and how to implement [right-to-left (RTL) text](#right-to-left-support).

## Localize text

### Translation keys

You can use the `localeText` prop to pass your own text and translations.
You can find [all supported translation keys](https://github.com/mui/mui-x/blob/-/packages/x-charts/src/locales/enUS.ts) in the source code on GitHub.

The example below customizes the labels of the loading overlay.

{{"demo": "CustomLocaleOverlay.js", "bg": "inline"}}

### Built-in locales

The library provides a set of built-in translations maintained by the community.
You can import them as follows:

```js
// Import French (France) locale
import { frFRLocaleText } from '@mui/x-charts/locales';
// or
import { frFRLocaleText } from '@mui/x-charts-pro/locales';
```

You can find [all built-in locales](https://github.com/mui/mui-x/tree/HEAD/packages/x-charts/src/locales) in the source code on GitHub.

To create your own translation or customize the English text, copy this file to your project, make any changes needed, and import the locale from there.
Note that these chart component translations follow [Material UI's localization strategy](/material-ui/guides/localization/).

The list of built-in translations and their completion level is available in the [translation status table](#translation-status).
If a translation is missing, you're welcome to open a PR to complete missing keys or add support for additional languages.

### Set translations locally

To pass language translations to multiple components, you can load the built-in language translations from the Charts package you're using and pass them to `ChartsLocalizationProvider`.
This applies `localeText` to all charts inside the provider.

```jsx
import { ChartsLocalizationProvider } from '@mui/x-charts/ChartsLocalizationProvider';
import { frFRLocaleText } from '@mui/x-charts/locales';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';

<ChartsLocalizationProvider localeText={frFRLocaleText}>
  <BarChart />
  <LineChart />
</ChartsLocalizationProvider>;
```

### Set translations globally

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

In this example, the imported `frFR` is a helper built on top of `frFRLocaleText`.
You can pass it to `createTheme()`.

```js
const frFR = {
  components: {
    MuiChartsLocalizationProvider: {
      defaultProps: {
        localeText: frFRLocaleText,
      },
    },
  },
};
```

Note that `createTheme()` accepts any number of arguments.
If you're already [using a custom locale with Material UI](/material-ui/guides/localization/#locale-text), you can add `frFR` as a new argument.

```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BarChart } from '@mui/x-charts/BarChart';
import { frFR } from '@mui/x-charts/locales';
import { frFR as dataGridFrFR } from '@mui/x-data-grid/locales';
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

## Right-to-left support

See [Right-to-left support](/material-ui/customization/right-to-left/) in the Material UI docs for complete details on working with languages such as Arabic, Persian, or Hebrew.

## Translation status

{{"demo": "ChartsLocalizationTableNoSnap.js", "hideToolbar": true, "bg": "inline"}}
