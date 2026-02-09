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
import { addDays } from 'date-fns';
import { useEventCalendarView } from '@mui/x-scheduler-headless/use-event-calendar-view';

function CustomView() {
  const adapter = useAdapter();

  useEventCalendarView(() => ({
    siblingVisibleDateGetter: (date, delta) => addDays(date, delta),
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

### Initialize / control the preferences

```tsx
const defaultPreferences = {
  ampm: false,
  showWeekends: false,
  isSidePanelOpen: false,
}

<EventCalendar defaultPreferences={defaultPreferences} />;
```

{{"demo": "DefaultPreferences.js", "bg": "inline", "defaultCodeOpen": false}}

:::success
You can also control the preferences using `preferences` and `onPreferencesChange` props:

```tsx
const [preferences, setPreferences] = React.useState<
  Partial<EventCalendarPreferences>
>({});

return (
  <EventCalendar preferences={preferences} onPreferencesChange={setPreferences} />
);
```

:::

### Preferences menu

You can customize the preferences menu using the `preferencesMenuConfig` prop:

Available properties:

- `toggleWeekendVisibility`: show/hide the menu item that toggles weekend visibility.
- `toggleWeekNumberVisibility`: show/hide the menu item that toggles week number visibility.
- `toggleAmpm`: show/hide the menu item that toggles 12/24‑hour time format.
- `toggleEmptyDaysInAgenda`: show/hide the menu item that toggles the visibility of days with no events in the Agenda view.

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

### Color palettes

The Event Calendar supports several color palettes.

Event colors can be set at two levels. The effective color resolves in the following order:

1. The `color` assigned to the event

```tsx
<EventCalendar events={[{ id: '1', title: 'Event 1', color: 'pink' }]} />
```

2. The `eventColor` assigned to the event's resource

```tsx
<EventCalendar resources={[{ id: '1', title: 'Resource 1', eventColor: 'pink' }]} />
```

3. The `eventColor` assigned to the Event Calendar

```tsx
<EventCalendar eventColor="pink" />
```

4. The default color palette, `"teal"`

The following demo shows one event for each palette:

{{"demo": "ColorPalettes.js", "bg": "inline", "defaultCodeOpen": false}}

### Translations

```tsx
import { frFR } from '@mui/x-scheduler/translations';

<EventCalendar translations={frFR} />;
```

{{"demo": "Translations.js", "bg": "inline", "defaultCodeOpen": false}}
