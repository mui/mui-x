---
productId: x-scheduler
title: React Scheduler component
packageName: '@mui/x-scheduler'
githubLabel: 'scope: scheduler'
---

# Event Calendar - Navigation

<p class="description">Navigate in time to find the events you are looking for.</p>

{{"component": "@mui/docs/ComponentLinkHeader", "design": false}}

:::warning
This package is not published yet.
:::

## Default visible date

Use the `defaultVisibleDate` prop to initialize the visible date:

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

## Imperative API

To use the `apiRef` object, you need to initialize it using the `useEventCalendarApiRef()` or `useEventCalendarPremiumApiRef()` hook as follows:

```tsx
// Community package
const apiRef = useEventCalendarApiRef();

return <EventCalendar apiRef={apiRef} events={EVENTS} />;

// Premium package
const apiRef = useEventCalendarPremiumApiRef();

return <EventCalendarPremium apiRef={apiRef} events={EVENTS} />;
```

When your component first renders, `apiRef.current` is `undefined`.
After the initial render, `apiRef` holds methods to interact imperatively with the Event Calendar.

### Set the visible date

Use the `setVisibleDate()` API method to navigate to a given date:

```ts
apiRef.current.setVisibleDate({
  // The DOM event that triggered the change (we be passed to onVisibleDateChange if provided).
  event,
  // The date to navigate to.
  visibleDate,
});
```

{{"demo": "ApiMethodSetVisibleDate.js", "defaultCodeOpen": false}}
