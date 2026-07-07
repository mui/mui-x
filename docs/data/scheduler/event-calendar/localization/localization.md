---
productId: x-scheduler
title: React Scheduler component
packageName: '@mui/x-scheduler'
githubLabel: 'scope: scheduler'
components: EventCalendar, EventCalendarPremium
---

# Event Calendar - Localization

<p class="description">Translate UI labels and date formats to support a global audience.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader", "design": false}}

The default locale of MUI X is English (United States).

## Translation keys

Use the `localeText` prop to pass in your own text and translations.
You can find all supported translation keys in [the source](https://github.com/mui/mui-x/blob/HEAD/packages/x-scheduler/src/models/translations.ts) on GitHub.
The demo below customizes the labels of the view switcher buttons.

{{"demo": "CustomLocaleTextCalendar.js", "bg": "inline", "defaultCodeOpen": false}}

## Locale text

Use the theme to configure the locale text:

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

The `createTheme()` function accepts any number of arguments.
If you're already using the [translations of the core components](/material-ui/guides/localization/#locale-text), you can add `frFR` as a new argument.
The same import works for Event Calendar Premium, which extends Event Calendar.

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

To pass language translations directly to the Event Calendar without using `createTheme()` and `ThemeProvider`, load them from `@mui/x-scheduler/locales`.

```jsx
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { frFR } from '@mui/x-scheduler/locales';

<EventCalendar
  localeText={frFR.components.MuiEventCalendar.defaultProps.localeText}
/>;
```

{{"demo": "LocaleTextCalendar.js", "bg": "inline", "defaultCodeOpen": false}}

## Date locale

The `localeText` prop only translates the UI labels (button text, menu items, etc.).
To also translate formatted dates (day names, month names, and week start day), pass a `date-fns` locale object.

Use the `createDateLocaleTheme` helper to set the date locale globally via the theme, alongside `localeText` translations:

```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { fr } from 'date-fns/locale/fr';
import { frFR, createDateLocaleTheme } from '@mui/x-scheduler/locales';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';

const theme = createTheme(
  {
    palette: {
      primary: { main: '#1976d2' },
    },
  },
  frFR,
  createDateLocaleTheme(fr),
);

<ThemeProvider theme={theme}>
  <EventCalendar />
</ThemeProvider>;
```

You can pass the `dateLocale` prop directly to the component to override the theme value or avoid using a theme:

```jsx
import { fr } from 'date-fns/locale/fr';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';

<EventCalendar dateLocale={fr} />;
```

{{"demo": "DateLocaleCalendar.js", "bg": "inline", "defaultCodeOpen": false}}

### Supported locales

You can [find the source](https://github.com/mui/mui-x/tree/HEAD/packages/x-scheduler/src/locales) on GitHub.

{{"demo": "SchedulerLocalisationTableNoSnap.js", "hideToolbar": true, "bg": "inline"}}

To create your own translation or customize the English text, copy this file to your project, make any needed changes, and import the locale from there.
These translations follow [Material UI's localization strategy](/material-ui/guides/localization/).
