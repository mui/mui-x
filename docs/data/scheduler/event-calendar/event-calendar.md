---
productId: x-scheduler
title: React Scheduler component
packageName: '@mui/x-scheduler'
githubLabel: 'scope: scheduler'
---

# Scheduler - Event Calendar

<p class="description">A collection of React UI components to schedule your events.</p>

{{"component": "@mui/docs/ComponentLinkHeader", "design": false}}

:::warning
This package is not published yet.
:::

## Full example

{{"demo": "FullEventCalendar.js", "bg": "inline", "defaultCodeOpen": false}}

## All day events

You can use the `allDay` property on your event model to define it as all-day:

```ts
const event = {
  // ...other even properties
  allDay: true,
};
```

{{"demo": "AllDay.js", "bg": "inline", "defaultCodeOpen": false}}

## Drag interactions

### Drag and resize events

You can enable the dragging and resizing of events within the Event Calendar using the `areEventsDraggable` and `areEventsResizable` props.
When `areEventsDraggable` is `true`, the events can be dragged to another point in time.
When `areEventsResizable` is `true`, the event extremities can be dragged to change its duration.

{{"demo": "DragAndDrop.js", "bg": "inline", "defaultCodeOpen": false}}

### External drag and drop

You can enable the dragging from and to the outside of the Event Calendar using the `canDragEventsFromTheOutside` and `canDropEventsToTheOutside` props.
When `canDragEventsFromTheOutside` is `true`, the events created with `<StandaloneEvent />` can be dropped inside the Event Calendar.
When `canDropEventsToTheOutside` is `true`, the events from within the Event Calendar can be dropped outside of it (not working yet).

:::success
To be able to drag an event to the outside, your events must be draggable, so `areEventsDraggable` must be `true`.
:::

{{"demo": "ExternalDragAndDrop.js", "bg": "inline", "defaultCodeOpen": false}}

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

### Add custom view

:::warning
The Event Calendar does not support custom views yet.
This sections is only here to track what the DX will look like once available.
:::

In your custom view, you have to use the `useEventCalendarView()` hook to register your view in the parent component.

```tsx
import { DateTime } from 'luxon';
import { useEventCalendarView } from '@mui/x-scheduler-headless/use-event-calendar-view';

function CustomView() {
  const adapter = useAdapter();

  useEventCalendarView(() => ({
    siblingVisibleDateGetter: (date, delta) => date.plus({ days: delta }),
  }));
}
```

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

The Event Calendar supports several color palettes.

Event colors can be set at two levels. The effective color resolves in the following order:

1. The `eventColor` assigned to the event's resource

```tsx
<EventCalendar resources={[{ id: '1', title: 'Resource 1', eventColor: 'pink' }]} />
```

2. The `eventColor` assigned to the Event Calendar

```tsx
<EventCalendar eventColor="pink" />
```

3. The default color palette, `"jade"`

The following demo shows one event for each palette:

{{"demo": "ColorPalettes.js", "bg": "inline", "defaultCodeOpen": false}}

### Translations

```tsx
import { frFR } from '@mui/x-scheduler/translations';

<EventCalendar translations={frFR} />;
```

{{"demo": "Translations.js", "bg": "inline", "defaultCodeOpen": false}}

### Preferences menu

You can customize the preferences menu using the `preferencesMenuConfig` prop:

Available properties:

- `toggleWeekendVisibility`: show/hide the menu item that toggles weekend visibility.
- `toggleWeekNumberVisibility`: show/hide the menu item that toggles week number visibility.
- `toggleAmpm`: show/hide the menu item that toggles 12/24‑hour time format.

```ts
// will hide the menu
preferencesMenuConfig={false}

// will hide the menu item responsible for toggling the weekend visibility
// the other preferences remain visible
preferencesMenuConfig={{ toggleWeekendVisibility: false }}

// will hide the menu items for toggling weekend and week number visibility
preferencesMenuConfig={{ toggleWeekendVisibility: false, toggleWeekNumberVisibility: false }}
```

{{"demo": "PreferencesMenu.js", "bg": "inline", "defaultCodeOpen": false}}
