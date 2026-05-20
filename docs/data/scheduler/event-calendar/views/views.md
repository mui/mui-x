---
productId: x-scheduler
title: React Scheduler component
packageName: '@mui/x-scheduler'
githubLabel: 'scope: scheduler'
components: EventCalendar, EventCalendarPremium, StandaloneAgendaView, StandaloneDayView, StandaloneWeekView, StandaloneMonthView, StandaloneCompactDayTimeGrid
---

# Event Calendar - Views

<p class="description">Choose which views are available in the Event Calendar.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader", "design": false}}

## All views

### Week view

The `week` view lets users manage events for an entire week.

{{"demo": "BasicWeekView.js", "bg": "inline", "defaultCodeOpen": false}}

### Day view

The `day` view lets users manage events for a single day.

{{"demo": "BasicDayView.js", "bg": "inline", "defaultCodeOpen": false}}

### Month view

The `month` view lets users manage events for an entire month.

{{"demo": "BasicMonthView.js", "bg": "inline", "defaultCodeOpen": false}}

### Agenda view

The `agenda` view lets users manage events in a list layout.

{{"demo": "BasicAgendaView.js", "bg": "inline", "defaultCodeOpen": false}}

### Compact day/time grid 🧪

:::warning
The `CompactDayTimeGrid` is a work-in-progress, opt-in component intended for narrow / mobile widths.
It is currently only available as a standalone view; it is not registered with the Event Calendar view registry yet.
:::

The `CompactDayTimeGrid` is a compact variant of the day/time grid optimized for narrow viewports.
It shares the same `DayTimeGrid` engine as the desktop week view but applies a `compact` density token, which:

- uses a smaller typography scale,
- removes the right padding reserved on each time-grid column for drag-to-create (events fill the column width),
- shows only the event title (the start/end time is hidden); the title wraps to all available lines and ellipsizes only when no more wrapping is possible.

Use the `dayCount` prop (`1`, `3`, or `7`) to control how many consecutive days are visible starting from the current visible date. The default is `3`.

{{"demo": "CompactDayTimeGrid.js", "bg": "inline", "defaultCodeOpen": false}}

Use the toggle below to test how the view adapts to each `dayCount` value:

{{"demo": "CompactDayTimeGridDayCount.js", "bg": "inline", "defaultCodeOpen": false}}

### Year view 🚧

:::warning
This feature isn't available yet, but it is planned—you can 👍 upvote [this GitHub issue](https://github.com/mui/mui-x/issues/21539) to help us prioritize it.
Please don't hesitate to leave a comment there to describe your needs, especially if you have a use case we should address or you're facing specific pain points with your current solution.
:::

With this feature, users would be able to view and manage events across an entire year.

### Resource views [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan') 🚧

:::warning
This feature isn't available yet, but it is planned—you can 👍 upvote [this GitHub issue](https://github.com/mui/mui-x/issues/21599) to help us prioritize it.
Please don't hesitate to leave a comment there to describe your needs, especially if you have a use case we should address or you're facing specific pain points with your current solution.
:::

With this feature, users would be able to view events grouped by resource in a dedicated view.

## Limit available views

Use the `views` prop to define which views can be accessed in the Event Calendar:

```tsx
<EventCalendar views={['week', 'month']} />
```

{{"demo": "RemoveViews.js", "bg": "inline", "defaultCodeOpen": false}}

## Default view

Use the `defaultView` prop to initialize the view:

```tsx
<EventCalendar defaultView="agenda" />
```

{{"demo": "DefaultView.js", "bg": "inline", "defaultCodeOpen": false}}

:::success
You can also control the view using the `view` and `onViewChange` props:

```tsx
const [view, setView] = React.useState('week');

return <EventCalendar view={view} onViewChange={setView} />;
```

:::
