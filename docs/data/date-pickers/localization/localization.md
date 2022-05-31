---
title: Date and time pickers - Localization
---

# Date and time pickers - Localization

<p class="description">Date and time pickers allow to support users from different locales, with formatting, RTL, and localized strings.</p>

The default locale of MUI is English (United States). If you want to use other locales, follow the instructions below.

Localization can impact pickers components rendering in two distincts ways: The date format, and the components attributes such as `aria-label`.

## Date-engine locale

Use `LocalizationProvider` to change the date-engine locale that is used to render pickers. Here is an example of changing the locale for the `date-fns` adapter:

{{"demo": "LocalizedDatePicker.js"}}

## Translation keys

As the rest of MUI components, you can modify text and translations.
You can find all the translation keys supported in [the source](https://github.com/mui/mui-x/blob/HEAD/packages/x-date-pickers/src/locales/utils/pickersLocaleTextApi.ts)
in the GitHub repository.

You can set the locale text by using the theme provider.

```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CalendarPicker, LocalizationProvider, bgBG } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import bgLocale from 'date-fns/locale/bg';

const theme = createTheme(
  {
    palette: {
      primary: { main: '#1976d2' },
    },
  },
  bgBG, // use 'bg' locale for UI texts (start, next month, ...)
);

<ThemeProvider theme={theme}>
  <LocalizationProvider
    dateAdapter={AdapterDateFns}
    adapterLocale={bgLocale} // use 'bg' locale for date parser/formatter
  >
    <CalendarPicker />
  </LocalizationProvider>
</ThemeProvider>;
```

Note that `createTheme` accepts any number of arguments.
If you are already using the [translations of the core components](/material-ui/guides/localization/#locale-text) or the [translations of the data grid](/x/react-data-grid/localization/#locale-text), you can add `bgBG` as a new argument.
The same import works for `DataGridPro` as it's an extension of `DataGrid`.

```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DataGrid, bgBG as dataGridBgBG } from '@mui/x-data-grid';
import { bgBG as coreBgBG } from '@mui/material/locale';
import bgLocale from 'date-fns/locale/bg';

import { CalendarPicker, LocalizationProvider, bgBG } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const theme = createTheme(
  {
    palette: {
      primary: { main: '#1976d2' },
    },
  },
  bgBG, // x-date-pickers translations
  dataGridBgBG, // x-data-grid translations
  coreBgBG, // core translations
);

<ThemeProvider theme={theme}>
  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={bgLocale}>
    <CalendarPicker />
    <DataGrid />
  </LocalizationProvider>
</ThemeProvider>;
```

If you want to pass language translations without using `createTheme` and `ThemeProvider`, you can directly load the language translations from the `@mui/x-date-pickers` or `@mui/x-date-pickers-pro` package and pass them to the `LocalizationProvider`.

```jsx
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { CalendarPicker, LocalizationProvider, bgBG } from '@mui/x-date-pickers';
import bgLocale from 'date-fns/locale/bg';

<LocalizationProvider
  dateAdapter={AdapterDateFns}
  adapterLocale={bgLocale}
  localeText={bgBG.components.MuiLocalizationProvider.defaultProps.localeText}
>
  <CalendarPicker />
</LocalizationProvider>;
```

## Supported locales

| Locale                  | BCP 47 language tag | Import name |
| :---------------------- | :------------------ | :---------- |
| English (United States) | en-US               | `enUS`      |
| French                  | fr-FR               | `frFR`      |
| German                  | de-DE               | `deDE`      |
| Turkish                 | tr-TR               | `trTr`      |

You can [find the source](https://github.com/mui/mui-x/tree/HEAD/packages/x-date-pickers/src/locales) in the GitHub repository.

To create your own translation or to customize the English text, copy this file to your project, make any changes needed and import the locale from there.
Note that these translations of the Data grid component depend on the [Localization strategy](/material-ui/guides/localization/) of the whole library.
