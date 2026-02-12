---
productId: x-scheduler
title: React Scheduler component
packageName: '@mui/x-scheduler'
githubLabel: 'scope: scheduler'
---

# Event Timeline - Localization

<p class="description">The Event Timeline supports translations between languages.</p>

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

```tsx
<EventTimelinePremium localeText={{ loading: 'Chargement...' }} />
```

## Locale text

You can use the theme to configure the locale text:

```tsx
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

Note that `createTheme()` accepts any number of arguments.
If you are already using the [translations of the core components](/material-ui/guides/localization/#locale-text), you can add `frFR` as a new argument.

```tsx
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

If you want to pass language translations directly to the Event Timeline without using `createTheme()` and `ThemeProvider`, you can directly load the language translations from `@mui/x-scheduler/locales`.

```tsx
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { frFR } from '@mui/x-scheduler/locales';

<EventTimelinePremium
  localeText={frFR.components.MuiEventTimeline.defaultProps.localeText}
/>;
```

{{"demo": "LocaleTextTimeline.js", "bg": "inline", "defaultCodeOpen": false}}
