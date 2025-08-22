---
productId: x-scheduler
title: React Scheduler component
packageName: '@mui/x-scheduler'
githubLabel: 'scope: scheduler'
---

# Scheduler - Overview

<p class="description">A collection of React UI components to schedule your events.</p>

{{"component": "@mui/docs/ComponentLinkHeader", "design": false}}

:::warning
This package is not published yet.
:::

## Full example

{{"demo": "FullEventCalendar.js", "bg": "inline", "defaultCodeOpen": false}}

## Customization

### Available views

```tsx
<EventCalendar views={['week', 'month']} />
```

{{"demo": "RemoveViews.js", "bg": "inline"}}

### Default view

{{"demo": "DefaultViews.js", "bg": "inline"}}

### Default visible date

### Color palettes

The Event Calendar supports several color palettes:

{{"demo": "ColorPalettes.js", "bg": "inline", "defaultCodeOpen": false}}

### Translations

```tsx
import { frFR } from '@mui/x-scheduler/material/translations/frFR';

<EventCalendar translations={frFR} />;
```

{{"demo": "Translations.js", "bg": "inline", "defaultCodeOpen": false}}
