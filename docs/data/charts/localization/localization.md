---
title: Charts - Localization
productId: x-charts
components: ChartsLocalizationProvider, ChartDataProvider, ChartContainer
---

# Charts - Localization

<p class="description">Adapt charts to different languages and locales.</p>

The default locale is English (United States).
You can use other locales by following the instructions below.

## Localize text

### Translation keys

You can use the `localeText` prop to pass your own text and translations.
You can find all supported translation keys in [the source](https://github.com/mui/mui-x/blob/-/packages/x-charts/src/locales/enUS.ts) in the GitHub repository.
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

You can [find the source](https://github.com/mui/mui-x/tree/HEAD/packages/x-charts/src/locales) in the GitHub repository.

To create your own translation or customize the English text, copy this file to your project, make any changes needed, and import the locale from there.
Note that these chart component translations depend on the [Localization strategy](/material-ui/guides/localization/) of the whole library.

The list of built-in translations and their completion level is available in the [translation status table](#translation-status).
If a translation is missing, you're welcome to open a PR to complete missing keys or add support for additional languages.

### Set translations locally

To pass language translations to multiple components, you can load the built-in language translations from the `@mui/x-charts` or `@mui/x-charts-pro` package and pass them to the `ChartsLocalizationProvider`.

The `localeText` will be applied to all charts inside the provider.

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
If you're already using the [translations of the core components](/material-ui/guides/localization/#locale-text), you can add `frFR` as a new argument.
The same import works for Charts Pro since it's an extension of Charts.

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

Right-to-left languages such as Arabic, Persian, or Hebrew are supported.
See [the right-to-left guide](/material-ui/customization/right-to-left/) for more information.

## Translation status

{{"demo": "ChartsLocalizationTableNoSnap.js", "hideToolbar": true, "bg": "inline"}}
