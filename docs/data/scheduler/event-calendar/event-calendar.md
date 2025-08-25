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

## Drag interactions

You can enable the drag and drop using the `areEventsDraggable` and `areEventsResizable` props.
When `areEventsDraggable` is `true`, the events can be dragged to another point in time.
When `areEventsResizable` is `true`, the event extremities can be dragged to change its duration.

{{"demo": "DragAndDrop.js", "bg": "inline", "defaultCodeOpen": false}}

## Customization

### Available views

```tsx
<EventCalendar views={['week', 'month']} />
```

{{"demo": "RemoveViews.js", "bg": "inline", "defaultCodeOpen": false}}

### Default view

```tsx
<EventCalendar defaultView="month" />
```

{{"demo": "DefaultView.js", "bg": "inline", "defaultCodeOpen": false}}

:::success
You can also control the view using the `view` and `onViewChange` props:

```tsx
const [view, setView] = React.useState('week');

return <EventCalendar view={view} onViewChange={setView} />;
```

:::

### Default visible date

```tsx
const defaultVisibleDate = DateTime.fromISO('2025-11-01');

<EventCalendar defaultVisibleDate={defaultVisibleDate} />;
```

{{"demo": "DefaultVisibleDate.js", "bg": "inline", "defaultCodeOpen": false}}

:::success
You can also control the visible date using the `visibleDate` and `onVisibleDateChange` props:

```tsx
const [visibleDate, setVisibleDate] = React.useState(() => DateTime.now());

return (
  <EventCalendar visibleDate={visibleDate} onVisibleDateChange={setVisibleDate} />
);
```

:::

### Color palettes

The Event Calendar supports several color palettes:

{{"demo": "ColorPalettes.js", "bg": "inline", "defaultCodeOpen": false}}

### Translations

```tsx
import { frFR } from '@mui/x-scheduler/material/translations/frFR';

<EventCalendar translations={frFR} />;
```

{{"demo": "Translations.js", "bg": "inline", "defaultCodeOpen": false}}
