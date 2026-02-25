---
productId: x-scheduler
title: React Scheduler component
packageName: '@mui/x-scheduler'
githubLabel: 'scope: scheduler'
---

# Event Calendar - Views

<p class="description">Choose which views are available in the Event Calendar.</p>

{{"component": "@mui/docs/ComponentLinkHeader", "design": false}}

:::warning
This package is not published yet.
:::

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
