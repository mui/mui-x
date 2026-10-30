---
productId: x-scheduler
title: React Scheduler component
packageName: '@mui/x-scheduler'
githubLabel: 'scope: scheduler'
components: EventTimelinePremium
---

# Event Timeline - Localization

<p class="description">Translate UI labels and date formats to support a global audience.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader", "design": false}}

The default locale of MUI X is English (United States).

## Translation keys

Use the `localeText` prop to pass in your own text and translations.
You can find all supported translation keys in [the source](https://github.com/mui/mui-x/blob/HEAD/packages/x-scheduler/src/models/translations.ts) on GitHub.
The demo below customizes the resource column header and loading text.

{{"demo": "CustomLocaleTextTimeline.js", "bg": "inline", "defaultCodeOpen": false}}

:::success
You can also customize the resource column header using the [`resourceColumnLabel`](/x/react-scheduler/event-timeline/resources/#resource-column-label) prop.
When provided, `resourceColumnLabel` takes priority over `localeText.timelineResourceTitleHeader`.
:::

## Locale text

Use the theme to configure the locale text:

```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
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
  <EventTimelinePremium />
</ThemeProvider>;
```

The `createTheme()` function accepts any number of arguments.
If you're already using the [translations of the core components](/material-ui/guides/localization/#locale-text), you can add `frFR` as a new argument.

```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
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
  <EventTimelinePremium />
</ThemeProvider>;
```

To pass language translations directly to the Event Timeline without using `createTheme()` and `ThemeProvider`, load them from `@mui/x-scheduler/locales`.

```jsx
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { frFR } from '@mui/x-scheduler/locales';

<EventTimelinePremium
  localeText={frFR.components.MuiEventTimeline.defaultProps.localeText}
/>;
```

{{"demo": "LocaleTextTimeline.js", "bg": "inline", "defaultCodeOpen": false}}

## Date locale

The `localeText` prop only translates the UI labels (button text, menu items, etc.).
To also translate **formatted dates** (day names, month names, and week start day), pass a locale to the `dateLocale` prop, such as `"fr-FR"`.
The dates are formatted with [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat), so `dateLocale` accepts the same locales, and they need no import.
The dates always use the Gregorian calendar, even when the default calendar of the locale is another one.

The locale also sets the numbering of the weeks, the first day of the week unless the [`weekStartsOn` preference](/x/react-scheduler/event-timeline/preferences/) is set, and the 12-hour or 24-hour clock unless the [`ampm` preference](/x/react-scheduler/event-timeline/preferences/) is set.
The first day of the week comes from [`Intl.Locale.prototype.getWeekInfo()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/getWeekInfo), or from the week data of the region of the locale in the browsers that don't support it, like Firefox.
The [Unicode extensions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale#description) of the locale change these settings: `"en-US-u-ca-iso8601"` numbers the weeks like ISO 8601, `"en-US-u-fw-mon"` starts them on Monday, and `"fr-FR-u-hc-h12"` shows the times on a 12-hour clock.

Use the `createDateLocaleTheme` helper to set the date locale globally via the theme, alongside `localeText` translations:

```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { frFR, createDateLocaleTheme } from '@mui/x-scheduler/locales';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';

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
  <EventTimelinePremium />
</ThemeProvider>;
```

You can also pass the `dateLocale` prop directly to the component to override the theme value or avoid using a theme:

```jsx
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';

<EventTimelinePremium dateLocale="fr-FR" />;
```

{{"demo": "DateLocaleTimeline.js", "bg": "inline", "defaultCodeOpen": false}}

### Supported locales

You can [find the source](https://github.com/mui/mui-x/tree/HEAD/packages/x-scheduler/src/locales) on GitHub.

{{"demo": "SchedulerLocalisationTableNoSnap.js", "hideToolbar": true, "bg": "inline"}}

To create your own translation or customize the English text, copy this file to your project, make any needed changes, and import the locale from there.
These translations follow the [Localization strategy](/material-ui/guides/localization/) of the whole library.

## RTL support

Right-to-left languages such as Arabic, Persian, or Hebrew are supported.
Follow the [right-to-left guide](/material-ui/customization/right-to-left/) to set them up.

Set `dir="rtl"` on the `<html>` or `<body>` element, not on a wrapper around the Event Timeline.
The Event Timeline renders its dialogs and popovers in a portal at the end of `<body>`, so a `dir` attribute on a wrapper element doesn't apply to them.

The demo below uses the Hebrew translations (`heIL`) and the `he-IL` date locale.
The documentation page is left-to-right, so this demo sets `dir="rtl"` on its container instead, and its dialogs and popovers stay left-to-right.

{{"demo": "RTLTimeline.js", "bg": "inline"}}
