---
productId: x-scheduler
title: React Scheduler component - Lazy loading
packageName: '@mui/x-scheduler-premium'
githubLabel: 'scope: scheduler'
---

# Event Calendar - Lazy loading events [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

<p class="description">The `dataSource` prop accepts a `getEvents()` method to lazily load events.</p>

{{"component": "@mui/docs/ComponentLinkHeader", "design": false}}

Instead of loading all events upfront, you can use the `dataSource` prop to fetch events on demand as the user navigates between dates and views.
The `dataSource.getEvents(start, end)` method is called whenever the visible date range changes, so only the events needed for the current view are fetched.

## Basic usage

To enable lazy loading, pass a `dataSource` object with a `getEvents` method to the Event Calendar.
The `getEvents` method receives a date range and should return a promise that resolves with the events for that range.

The `events` prop serves as the initial state—pass an empty array when all events come from the server.

```tsx
<EventCalendarPremium
  events={[]}
  dataSource={{ getEvents: async (start, end) => fetchEventsFromServer(start, end) }}
/>
```

The `dataSource` object also accepts an `updateEvents` method to persist changes (created, updated, and deleted events) back to the server.

{{"demo": "BasicDataSource.js", "bg": "inline", "defaultCodeOpen": false}}

:::info
The demos on this page use a fake server utility to simulate asynchronous data fetching.
In a real-world scenario, you would replace it with your own server-side data fetching logic.
:::

## Error handling

When the `dataSource.getEvents` method rejects, the Scheduler displays an error state.
Use the toggle button to simulate a server error.

{{"demo": "ErrorHandling.js", "bg": "inline", "defaultCodeOpen": false}}
