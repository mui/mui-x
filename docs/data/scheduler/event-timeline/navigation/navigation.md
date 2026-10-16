---
productId: x-scheduler
title: React Scheduler component
packageName: '@mui/x-scheduler'
githubLabel: 'scope: scheduler'
components: EventTimelinePremium
---

# Event Timeline - Navigation

<p class="description">Control the visible date and navigate programmatically with the imperative API.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader", "design": false}}

## Default visible date

Use the `defaultVisibleDate` prop to initialize the visible date:

```tsx
const defaultVisibleDate = DateTime.fromISO('2025-11-01');

<EventTimelinePremium defaultVisibleDate={defaultVisibleDate} />;
```

{{"component": "file://./demos/default-visible-date/index.ts", "bg": "inline", "collapseToEmpty": true}}

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

To use the `apiRef` object, initialize it with the `useEventTimelinePremiumApiRef()` hook:

```tsx
const apiRef = useEventTimelinePremiumApiRef();

return <EventTimelinePremium apiRef={apiRef} events={EVENTS} />;
```

When your component first renders, `apiRef.current` is `undefined`.
After the initial render, `apiRef` holds methods to interact imperatively with the Event Timeline.

### Set the visible date

Use the `setVisibleDate()` API method to navigate to a given date:

```ts
apiRef.current.setVisibleDate({
  // The DOM event that triggered the change (will be passed to onVisibleDateChange if provided).
  event,
  // The date to navigate to.
  visibleDate,
});
```

{{"component": "file://./demos/api-method-set-visible-date/index.ts", "collapseToEmpty": true}}

### Navigate to the next and previous range

Use the `goToNextVisibleDate()` and `goToPreviousVisibleDate()` API methods to navigate forward and backward in time.
The step size is automatically determined by the current preset:

<!-- TODO: Remove this table once users can pass custom step ranges (#21359). -->

| Preset         | Step                |
| :------------- | :------------------ |
| `dayAndHour`   | 4 days              |
| `dayAndMonth`  | 56 days (8 weeks)   |
| `dayAndWeek`   | 16 weeks            |
| `monthAndYear` | 36 months (3 years) |
| `year`         | 30 years            |

```ts
// Navigate to the next date range
apiRef.current.goToNextVisibleDate(event);

// Navigate to the previous date range
apiRef.current.goToPreviousVisibleDate(event);
```

The steps move the visible date on the days of `displayTimezone`, and `onVisibleDateChange` receives the new date in that timezone.

{{"component": "file://./demos/external-navigation/index.ts", "bg": "inline", "collapseToEmpty": true}}
