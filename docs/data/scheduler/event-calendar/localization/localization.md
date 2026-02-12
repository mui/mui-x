---
productId: x-scheduler
title: React Scheduler component
packageName: '@mui/x-scheduler'
githubLabel: 'scope: scheduler'
---

# Event Calendar - Localization

<p class="description">The Event Calendar's localization features provide the appropriate translations for users around the world.</p>

{{"component": "@mui/docs/ComponentLinkHeader", "design": false}}

:::warning
This package is not published yet.
:::

The default locale of MUI X is English (United States).
To use other locales, follow the instructions below.

## Translation keys

You can use the `localeText` prop to pass in your own text and translations.
You can find all the translation keys supported in [the source](https://github.com/mui/mui-x/blob/HEAD/packages/x-scheduler/src/models/translations.ts)
in the GitHub repository.
In the following example, the labels of the view switcher buttons are customized.

{{"demo": "CustomLocaleTextCalendar.js", "bg": "inline", "defaultCodeOpen": false}}

## Locale text

The default locale of MUI X is English (United States).

You can use the theme to configure the locale text:

```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { frFR } from '@mui/x-scheduler/locales';
// Or import { frFR } from '@mui/x-scheduler-premium/locales';

const theme = createTheme(
  {
    palette: {
      primary: { main: '#1976d2' },
    },
  },
  frFR,
);

<ThemeProvider theme={theme}>
  <EventCalendar />
</ThemeProvider>;
```

Note that `createTheme()` accepts any number of arguments.
If you are already using the [translations of the core components](/material-ui/guides/localization/#locale-text), you can add `frFR` as a new argument.
The same import works for Event Calendar Premium as it's an extension of Event Calendar.

```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { frFR } from '@mui/x-scheduler/locales';
import { frFR as pickersFrFR } from '@mui/x-date-pickers/locales';
import { frFR as coreFrFR } from '@mui/material/locale';

const theme = createTheme(
  {
    palette: {
      primary: { main: '#1976d2' },
    },
  },
  frFR, // x-scheduler translations
  pickersFrFR, // x-date-pickers translations
  coreFrFR, // core translations
);

<ThemeProvider theme={theme}>
  <EventCalendar />
</ThemeProvider>;
```

If you want to pass language translations directly to the Event Calendar without using `createTheme()` and `ThemeProvider`, you can directly load the language translations from `@mui/x-scheduler/locales`.

```jsx
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { frFR } from '@mui/x-scheduler/locales';

<EventCalendar
  localeText={frFR.components.MuiEventCalendar.defaultProps.localeText}
/>;
```

{{"demo": "LocaleTextCalendar.js", "bg": "inline", "defaultCodeOpen": false}}

### Supported locales

You can [find the source](https://github.com/mui/mui-x/tree/HEAD/packages/x-scheduler/src/locales) in the GitHub repository.

| Locale                  | BCP 47 language tag | Import name |
| :---------------------- | :------------------ | :---------- |
| English (United States) | en-US               | `enUS`      |
| French                  | fr-FR               | `frFR`      |

To create your own translation or to customize the English text, copy this file to your project, make any changes needed and import the locale from there.
Note that these translations of the Scheduler component depend on the [Localization strategy](/material-ui/guides/localization/) of the whole library.
