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
To also translate **formatted dates** (day names, month names, and week start day), pass a `date-fns` locale object.

Use the `createDateLocaleTheme` helper to set the date locale globally via the theme, alongside `localeText` translations:

```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { fr } from 'date-fns/locale/fr';
import { frFR, createDateLocaleTheme } from '@mui/x-scheduler/locales';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';

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
  <EventTimelinePremium />
</ThemeProvider>;
```

You can also pass the `dateLocale` prop directly to the component to override the theme value or avoid using a theme:

```jsx
import { fr } from 'date-fns/locale/fr';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';

<EventTimelinePremium dateLocale={fr} />;
```

{{"demo": "DateLocaleTimeline.js", "bg": "inline", "defaultCodeOpen": false}}

### Supported locales

You can [find the source](https://github.com/mui/mui-x/tree/HEAD/packages/x-scheduler/src/locales) on GitHub.

{{"demo": "SchedulerLocalisationTableNoSnap.js", "hideToolbar": true, "bg": "inline"}}

To create your own translation or customize the English text, copy this file to your project, make any needed changes, and import the locale from there.
These translations follow the [Localization strategy](/material-ui/guides/localization/) of the whole library.
