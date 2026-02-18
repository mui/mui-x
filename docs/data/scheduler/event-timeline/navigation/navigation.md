---
productId: x-scheduler
title: React Scheduler component
packageName: '@mui/x-scheduler'
githubLabel: 'scope: scheduler'
---

# Event Timeline - Navigation

<p class="description">Navigate in time to find the events you are looking for.</p>

{{"component": "@mui/docs/ComponentLinkHeader", "design": false}}

:::warning
This package is not published yet.
:::

## Default visible date

Use the `defaultVisibleDate` prop to initialize the visible date:

```tsx
const defaultVisibleDate = DateTime.fromISO('2025-11-01');

<EventTimelinePremium defaultVisibleDate={defaultVisibleDate} />;
```

{{"demo": "DefaultVisibleDate.js", "bg": "inline", "defaultCodeOpen": false}}

:::success
You can also control the visible date using the `visibleDate` and `onVisibleDateChange` props:

```tsx
const [visibleDate, setVisibleDate] = React.useState(() => DateTime.now());

return (
  <EventTimelinePremium
    visibleDate={visibleDate}
    onVisibleDateChange={setVisibleDate}
  />
);
```

:::

## Imperative API

To use the `apiRef` object, you need to initialize it using `useEventTimelinePremiumApiRef()` hook as follows:

```tsx
const apiRef = useEventTimelinePremiumApiRef();

return <EventTimelinePremium apiRef={apiRef} events={EVENTS} />;
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
