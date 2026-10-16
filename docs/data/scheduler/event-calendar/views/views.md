---
productId: x-scheduler
title: React Scheduler component
packageName: '@mui/x-scheduler'
githubLabel: 'scope: scheduler'
components: EventCalendar, EventCalendarPremium, StandaloneAgendaView, StandaloneAgendaViewPremium, StandaloneDayView, StandaloneDayViewPremium, StandaloneWeekView, StandaloneWeekViewPremium, StandaloneMonthView, StandaloneMonthViewPremium
---

# Event Calendar - Views

<p class="description">Configure available views including week, day, month, and agenda, and control the default view.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader", "design": false}}

## All views

### Week view

The `week` view lets users manage events for an entire week.

{{"component": "file://./demos/basic-week-view/index.ts", "bg": "inline", "collapseToEmpty": true}}

Use the `viewConfig` prop to limit the hours displayed in the time grid with `startTime` and `endTime`:

{{"component": "file://./demos/week-view-start-end-time/index.ts", "bg": "inline", "collapseToEmpty": true}}

:::warning
`startTime` and `endTime` must be whole hours (integers between `0` and `24`) with `startTime` lower than `endTime`. Minute-level precision isn't supported yet. An invalid range falls back to the full day and logs a warning in development.
:::

By default, the time grid scrolls to 7 AM when it mounts (or to `startTime` when 7 AM isn't a displayed hour).
Use `initialScrollTime` to scroll to a different hour.
Navigating to another week keeps the current scroll position; switching to another view and back scrolls again.

{{"component": "file://./demos/week-view-initial-scroll-time/index.ts", "bg": "inline", "collapseToEmpty": true}}

:::warning
`initialScrollTime` must be a displayed hour (`startTime` to `endTime - 1`). An invalid value falls back to the default and logs a warning in development.
:::

### Day view

The `day` view lets users manage events for a single day.

{{"component": "file://./demos/basic-day-view/index.ts", "bg": "inline", "collapseToEmpty": true}}

The `viewConfig` prop also limits the hours displayed in the day view with `startTime` and `endTime`:

{{"component": "file://./demos/day-view-start-end-time/index.ts", "bg": "inline", "collapseToEmpty": true}}

:::warning
`startTime` and `endTime` must be whole hours (integers between `0` and `24`) with `startTime` lower than `endTime`. Minute-level precision isn't supported yet. An invalid range falls back to the full day and logs a warning in development.
:::

By default, the time grid scrolls to 7 AM when it mounts (or to `startTime` when 7 AM isn't a displayed hour).
Use `initialScrollTime` to scroll to a different hour.
Navigating to another day keeps the current scroll position; switching to another view and back scrolls again.

{{"component": "file://./demos/day-view-initial-scroll-time/index.ts", "bg": "inline", "collapseToEmpty": true}}

:::warning
`initialScrollTime` must be a displayed hour (`startTime` to `endTime - 1`). An invalid value falls back to the default and logs a warning in development.
:::

### Month view

The `month` view lets users manage events for an entire month.

{{"component": "file://./demos/basic-month-view/index.ts", "bg": "inline", "collapseToEmpty": true}}

### Agenda view

The `agenda` view lets users manage events in a list layout.

{{"component": "file://./demos/basic-agenda-view/index.ts", "bg": "inline", "collapseToEmpty": true}}

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

{{"component": "file://./demos/remove-views/index.ts", "bg": "inline", "collapseToEmpty": true}}

## Default view

Use the `defaultView` prop to initialize the view:

```tsx
<EventCalendar defaultView="agenda" />
```

{{"component": "file://./demos/default-view/index.ts", "bg": "inline", "collapseToEmpty": true}}

:::success
You can also control the view using the `view` and `onViewChange` props:

```tsx
const [view, setView] = React.useState('week');

return <EventCalendar view={view} onViewChange={setView} />;
```

:::
