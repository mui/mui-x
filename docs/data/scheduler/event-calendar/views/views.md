---
productId: x-scheduler
title: React Scheduler component
packageName: '@mui/x-scheduler'
githubLabel: 'scope: scheduler'
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

### Year view 🚧

:::warning
This feature isn't available yet, but it is planned — you can 👍 upvote [this GitHub issue](https://github.com/mui/mui-x/issues/21539) to help us prioritize it.
Please don't hesitate to leave a comment there to describe your needs, especially if you have a use case we should address or you're facing specific pain points with your current solution.
:::

With this feature, users would be able to view and manage events across an entire year.

### Resource views [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan') 🚧

:::warning
This feature isn't available yet, but it is planned — you can 👍 upvote [this GitHub issue](https://github.com/mui/mui-x/issues/21599) to help us prioritize it.
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
