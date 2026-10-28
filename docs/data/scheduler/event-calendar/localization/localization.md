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
To also translate **formatted dates** (day names, month names, and week start day), pass a locale to the `dateLocale` prop, such as `"fr-FR"`.
The dates are formatted with [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat), so `dateLocale` accepts the same locales, and they need no import.
The dates always use the Gregorian calendar, even when the default calendar of the locale is another one.

The locale also sets the numbering of the weeks, and the first day of the week unless the [`weekStartsOn` preference](/x/react-scheduler/event-calendar/preferences/) is set.
The first day of the week comes from [`Intl.Locale.prototype.getWeekInfo()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/getWeekInfo): the browsers that don't support it start the weeks on Monday.

Use the `createDateLocaleTheme` helper to set the date locale globally via the theme, alongside `localeText` translations:

```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { frFR, createDateLocaleTheme } from '@mui/x-scheduler/locales';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';

const theme = createTheme(
  {
    palette: {
      primary: { main: '#1976d2' },
    },
  },
  frFR,
  createDateLocaleTheme('fr-FR'),
);

<ThemeProvider theme={theme}>
  <EventCalendar />
</ThemeProvider>;
```

You can pass the `dateLocale` prop directly to the component to override the theme value or avoid using a theme:

```jsx
import { EventCalendar } from '@mui/x-scheduler/event-calendar';

<EventCalendar dateLocale="fr-FR" />;
```

{{"demo": "DateLocaleCalendar.js", "bg": "inline", "defaultCodeOpen": false}}

### Supported locales

You can [find the source](https://github.com/mui/mui-x/tree/HEAD/packages/x-scheduler/src/locales) on GitHub.

{{"demo": "SchedulerLocalisationTableNoSnap.js", "hideToolbar": true, "bg": "inline"}}

To create your own translation or customize the English text, copy this file to your project, make any needed changes, and import the locale from there.
These translations follow [Material UI's localization strategy](/material-ui/guides/localization/).

## RTL support

Right-to-left languages such as Arabic, Persian, or Hebrew are supported.
Follow the [right-to-left guide](/material-ui/customization/right-to-left/) to set them up.

Set `dir="rtl"` on the `<html>` or `<body>` element, not on a wrapper around the Event Calendar.
The Event Calendar renders its dialogs and popovers in a portal at the end of `<body>`, so a `dir` attribute on a wrapper element doesn't apply to them.

The demo below uses the Hebrew translations (`heIL`) and the `he-IL` date locale.
The documentation page is left-to-right, so this demo sets `dir="rtl"` on its container instead, and its dialogs and popovers stay left-to-right.

{{"demo": "RTLCalendar.js", "bg": "inline"}}
