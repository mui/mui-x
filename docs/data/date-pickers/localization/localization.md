---
productId: x-date-pickers
title: Date and Time Pickers - Translated components
components: LocalizationProvider
githubLabel: 'component: pickers'
packageName: '@mui/x-date-pickers'
---

# Translated components

<p class="description">Date and Time Pickers support translations between languages.</p>

As with all MUI X components, you can modify text and translations inside the Date and Time Pickers.
You can find all the translation keys supported in [the source](https://github.com/mui/mui-x/blob/HEAD/packages/x-date-pickers/src/locales/utils/pickersLocaleTextApi.ts)
in the GitHub repository.

The default locale of MUI X is English (United States). If you want to use other locales, follow the instructions below.

:::warning
This page focuses on translating the text inside the Date and Time Pickers.
If you need to change the formatting of the text to conform to a given locale, visit the [Date format and localization](/x/react-date-pickers/adapters-locale/) page.
:::

## Set translations globally

### Using the theme

To translate all your components from `@mui/x-date-pickers` and `@mui/x-date-pickers-pro`,
import the locale from `@mui/x-date-pickers` (see the [list of supported locales below](#supported-locales)).

```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { deDE } from '@mui/x-date-pickers/locales';

const theme = createTheme(
  {
    palette: {
      primary: { main: '#1976d2' },
    },
  },
  deDE, // use 'de' locale for UI texts (start, next month, ...)
);

function App({ children }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
```

Note that `createTheme` accepts any number of arguments.
If you are already using the [translations of the core components](/material-ui/guides/localization/#locale-text) or the [translations of the data grid](/x/react-data-grid/localization/#locale-text), you can add `deDE` as a new argument.

```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { deDE as dataGridDeDE } from '@mui/x-data-grid';
import { deDE as coreDeDE } from '@mui/material/locale';
import { deDE } from '@mui/x-date-pickers/locales';

const theme = createTheme(
  {
    palette: {
      primary: { main: '#1976d2' },
    },
  },
  deDE, // x-date-pickers translations
  dataGridDeDE, // x-data-grid translations
  coreDeDE, // core translations
);

function App({ children }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
```

### Using LocalizationProvider

If you want to pass language translations without using `createTheme` and `ThemeProvider`,
you can directly load the language translations from the `@mui/x-date-pickers` or `@mui/x-date-pickers-pro` package and pass them to the `LocalizationProvider`.

```jsx
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { deDE } from '@mui/x-date-pickers/locales';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

<LocalizationProvider
  localeText={deDE.components.MuiLocalizationProvider.defaultProps.localeText}
>
  <DatePicker />
</LocalizationProvider>;
```

## Set translations locally

You can also customize the translations of a single component.

If you want to customize some translations on specific component, you can use the `localeText` prop exposed by all our pickers.

```jsx
<DatePicker localeText={{ clearButtonLabel: 'Empty' }} />
```

:::info
This method can be combined with the ones shown above.

If you pass a localization through `LocalizationProvider` or the theme, and you provide translation keys through the `localeText` prop of a picker at the same time, then only the latter translation keys will be overridden.

```tsx
<LocalizationProvider
  localeText={{ clearButtonLabel: 'Empty', todayButtonLabel: 'Now' }}
>
  <DatePicker
    // ...other props
    localeText={{
      clearButtonLabel: 'Vider',
    }}
  />
</LocalizationProvider>
```

This will produce the following result:

- "Today" button with text **Now** taken from the Localization Provider's `localeText` prop
- "Clear" button with text **Vider** overridden by the Date Picker's `localeText` prop

:::

## Supported locales

{{"demo": "PickersLocalisationTableNoSnap.js", "hideToolbar": true, "bg": "inline"}}

You can [find the source](https://github.com/mui/mui-x/tree/HEAD/packages/x-date-pickers/src/locales) in the GitHub repository.

To create your own translation or to customize the English text, copy this file to your project, make any changes needed and import the locale from there.
Note that these translations of the date and time picker components depend on the [Localization strategy](/material-ui/guides/localization/) of the whole library.

## Access the translations in slots and subcomponents

You can use the `usePickersTranslations` hook to access the translations in your custom components.

```tsx
import { usePickersTranslations } from '@mui/x-date-pickers/hooks';

const translations = usePickersTranslations();
```

:::info
See [Custom slots and subcomponents—Action bar](/x/react-date-pickers/custom-components/#component) for more details.
:::
