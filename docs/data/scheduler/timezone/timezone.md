---
productId: x-scheduler
title: React Scheduler component
packageName: '@mui/x-scheduler'
githubLabel: 'scope: scheduler'
---

# Scheduler - Timezone

<p class="description">Display events correctly across different timezones.</p>

{{"component": "@mui/docs/ComponentLinkHeader", "design": false}}

:::warning
This package is not published yet.
:::

TODO: Issue #20394 - Create documentation and demos

## Overview

The Event Calendar and Event Timeline accepts event dates (`start` and `end`) as **strings** and supports two semantics depending on the format:

- **Instant strings** end with `"Z"` and represent a fixed moment in UTC, for example `"2024-01-10T13:00:00Z"`.
- **Wall-time strings** have no `"Z"` suffix and represent a local date/time that is interpreted in the event's `timezone`, for example `"2024-01-10T09:00:00"`.

All events are rendered in the timezone defined by the `displayTimezone` prop.

## Event date values

### Instant strings (with `Z`)

A string ending with `"Z"` represents a fixed moment in time.

```ts
const event = {
  id: '1',
  title: 'Team sync',
  start: '2024-01-10T13:00:00Z', // 13:00 UTC
  end: '2024-01-10T14:00:00Z',
};
```

This event is displayed as:

- `14:00` in `Europe/Paris` (UTC+1)
- `08:00` in `America/New_York` (UTC−5)

### Wall-time strings (without `Z`)

A string without a `"Z"` suffix represents a local time.
It is interpreted in `event.timezone` (or `"default"` if no timezone is set).

```ts
const event = {
  id: '1',
  title: 'Morning standup',
  start: '2024-01-10T09:00:00', // 09:00 local time in New York
  end: '2024-01-10T09:30:00',
  timezone: 'America/New_York',
};
```

This event always happens at 09:00 in New York, regardless of DST changes.

{{"demo": "TimezoneDatasetWallTime.js", "bg": "inline", "defaultCodeOpen": false}}

## The `timezone` field

The `timezone` field on an event determines:

1. **How wall-time strings are interpreted** — a start of `"2024-01-10T09:00:00"` with `timezone: "America/New_York"` means 09:00 in New York (14:00 UTC in winter, 13:00 UTC in summer).
2. **How recurring event rules are evaluated** — a daily event at 09:00 in `Europe/Paris` stays at 09:00 local time even across DST boundaries.

For instant strings (ending with `"Z"`), the `timezone` field does not affect how the start/end are resolved — they are already absolute points in time.
However, it is still used for recurring event calculations.

:::success
If no `timezone` is set, the component uses the default timezone of your date library.
:::

## Rendering behavior

The `displayTimezone` prop controls how all events are rendered in the UI.

Changing `displayTimezone` only affects the visual representation.
It does not modify the event data or change when an event occurs.

```tsx
<EventCalendar
  // ...other props
  displayTimezone="Europe/Paris"
/>
```

{{"demo": "TimezoneInstantBased.js", "bg": "inline", "defaultCodeOpen": false}}

## Creating an event

When creating events from the UI, the entered date/time is interpreted in the current `displayTimezone`.

The created event does not include an explicit `timezone` field.
As a result, when the event is processed, its original timezone is treated as `"default"`.

## Recurring events and timezones [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

Recurring events define a pattern that is evaluated in a specific timezone.

For example, consider a daily recurring event that happens every day at 09:00
in the `Europe/Paris` timezone:

```ts
const event = {
  id: '1',
  title: 'Daily standup',
  start: '2024-03-01T08:00:00Z', // 09:00 in Paris (UTC+1 in winter)
  end: '2024-03-01T09:00:00Z',
  timezone: 'Europe/Paris',
  rrule: { freq: 'DAILY' },
};
```

Even when daylight saving time starts (March 31 in 2024), the event continues
to happen at 09:00 local time in Europe/Paris.

The Scheduler uses the event's `timezone` to interpret and expand
the recurrence pattern correctly across DST boundaries.

{{"demo": "TimezoneRecurringEvents.js", "bg": "inline", "defaultCodeOpen": false}}
