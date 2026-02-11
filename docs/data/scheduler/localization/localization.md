---
productId: x-scheduler
title: React Scheduler component
packageName: '@mui/x-scheduler'
githubLabel: 'scope: scheduler'
---

# Scheduler - Localization

<p class="description">The Event Calendar and Event Timeline support translations between languages.</p>

:::warning
This package is not published yet.
:::

As with all MUI X components, you can modify text and translations inside the Event Calendar.
You can find all the translation keys supported in [the source](https://github.com/mui/mui-x/blob/HEAD/packages/x-scheduler/src/models/translations.ts)
in the GitHub repository.

The default locale of MUI X is English (United States). If you want to use other locales, follow the instructions below.

## Translations

```tsx
import { frFR } from '@mui/x-scheduler/translations';

<EventCalendar translations={frFR} />;
<EventTimelinePremium translations={frFR} />;
```

{{"demo": "TranslationsCalendar.js", "bg": "inline", "defaultCodeOpen": false}}
{{"demo": "TranslationsTimeline.js", "bg": "inline", "defaultCodeOpen": false}}

:::warning
TODO: Unify DX with the Data Grid and the Date and Time Pickers.
And decide if we split this page between the Event Calendar and the Event Timeline.
:::
