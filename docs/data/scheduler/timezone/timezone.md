---
productId: x-scheduler
title: React Scheduler component
packageName: '@mui/x-scheduler'
githubLabel: 'scope: scheduler'
---

# Scheduler - Timezone

<p class="description">Display events correctly across different timezones.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader", "design": false}}

## Overview

The Event Calendar and Event Timeline accept event dates (`start` and `end`) as strings and support two semantics depending on the format:

- **Instant strings** end with `"Z"` or an offset and represent a fixed moment, for example `"2024-01-10T13:00:00Z"` or `"2024-01-10T14:00:00+01:00"`.
- **Wall-time strings** have no `"Z"` suffix or offset and represent a local date/time that is interpreted in the event's `timezone`, for example `"2024-01-10T09:00:00"`.

All events are rendered in the timezone defined by the `displayTimezone` prop.

## Event date values

### Instant strings (with `Z` or an offset)

A string ending with `"Z"` or an offset, like `"+01:00"`, represents a fixed moment in time.

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

### Wall-time strings (without `Z` or an offset)

A string without a `"Z"` suffix or an offset represents a local time.
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
A local time that a DST transition skips or repeats follows the same rules as the [occurrences of recurring events](#recurring-events-and-timezones).

{{"demo": "TimezoneDatasetWallTime.js", "bg": "inline", "defaultCodeOpen": false}}

## The `timezone` field

The `timezone` field on an event determines:

1. **How wall-time strings are interpreted**: a start of `"2024-01-10T09:00:00"` with `timezone: "America/New_York"` means 09:00 in New York (14:00 UTC in winter, 13:00 UTC in summer).
2. **How recurring event rules are evaluated**: a daily event at 09:00 in `Europe/Paris` stays at 09:00 local time even across DST boundaries.

For instant strings (ending with `"Z"` or an offset), the `timezone` field does not affect how the start/end are resolved—they are already absolute points in time.
However, it is still used for recurring event calculations.

:::success
If no `timezone` is set, the component uses the timezone of the system.
:::

## Rendering behavior

The `displayTimezone` prop controls how all events are rendered in the UI.

Changing `displayTimezone` does not modify the event data or change when an event occurs.
The visible date is read in `displayTimezone` too: the visible range starts on the day of `visibleDate` in that timezone, and the next and previous buttons pass `onVisibleDateChange` an instant on the new day in that timezone.
Read its day in `displayTimezone`, as the timezone of the browser can put it on another day.

```tsx
<EventCalendar
  // ...other props
  displayTimezone="Europe/Paris"
/>
```

{{"demo": "TimezoneInstantBased.js", "bg": "inline", "defaultCodeOpen": false}}

## Reading occurrence dates

Callbacks such as `onEventEditingStart` and hooks such as `useEventDialogOccurrence()` provide an occurrence with resolved `start` and `end` values.
Each bound contains:

- `value`: a `BaseTemporal.PlainDateTime` with the date and wall-clock time in `displayTimezone`.
- `timestamp`: the instant as milliseconds since the Unix epoch.

For all-day occurrences, `end` is exclusive: an occurrence covering July 1 ends at the start of July 2 in the display timezone.
Its last day is the day before the date of `end`: `occurrence.end.value.toPlainDate().add({ days: -1 })`.
The event models still end an all-day event on its last day: to write an all-day occurrence back to a model, use `occurrence.end.timestamp - 1`.
The date and time fields have no UTC offset; use `timestamp` to distinguish the two instances of an hour repeated by a daylight saving transition.

Import `BaseTemporal` to read and compare these values:

```ts
import { BaseTemporal } from '@mui/x-scheduler/base-temporal';

const firstDay = BaseTemporal.PlainDate.from('2025-07-01');
occurrence.start.value.toPlainDate().equals(firstDay);
BaseTemporal.PlainDateTime.compare(occurrence.start.value, occurrence.end.value);
```

The same namespace is available from `@mui/x-scheduler-premium/base-temporal`.
It provides a subset of Temporal for reading and comparing dates.
To format a date as the Scheduler displays it, format its fields, which are already in `displayTimezone`.
Reading them in UTC keeps the timezone of the browser out:

```ts
const { value } = occurrence.start;
const label = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'UTC',
}).format(
  Date.UTC(value.year, value.month - 1, value.day, value.hour, value.minute),
);
```

Use `timestamp` for instants and durations:

```ts
const durationMinutes =
  (occurrence.end.timestamp - occurrence.start.timestamp) / 60_000;
```

The occurrence's `timezone` and `rrule` describe the original event in its own timezone.
The rule's `until` is in the timezone of the event: a `BaseTemporal.PlainDate` includes its whole day, and a `BaseTemporal.PlainDateTime`, used for timed events only, is the latest start of an occurrence.
Exception dates belong to the series and are available as strings on `occurrence.modelInBuiltInFormat.exDates` for persisted occurrences.

## Supported timezones

Both the `displayTimezone` prop and the event's `timezone` field accept the following values:

|            Timezone | Description                                                                                                                                                |
| ------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------- |
|             `"UTC"` | Will use the [Coordinated Universal Time](https://en.wikipedia.org/wiki/Coordinated_Universal_Time)                                                        |
|         `"default"` | Will use the system's local timezone                                                                                                                       |
| IANA standard zones | Any [IANA](https://www.iana.org/time-zones) timezone, for example `"Europe/Paris"` or `"America/New_York"`. [Full list](https://timezonedb.com/time-zones) |

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
  rrule: 'FREQ=DAILY',
};
```

Even when daylight saving time starts (March 31 in 2024), the event continues
to happen at 09:00 local time in Europe/Paris.

The Scheduler uses the event's `timezone` to interpret and expand
the recurrence pattern correctly across DST boundaries.

When a DST transition skips the local time of an occurrence, the occurrence moves forward by the length of the gap: a daily event at 02:30 in `Europe/Paris` happens at 03:30 on the day clocks spring forward.
When a transition repeats the local time, the occurrence happens the first time the clock shows it.
Both rules follow the [RFC 5545](https://datatracker.ietf.org/doc/html/rfc5545#section-3.3.5) specification.

The event dialog reads and writes the recurrence rule in the event's `timezone` too: the weekday and day of month it offers, and the "Until" day, are the ones of the event in that timezone, which can differ from the day the occurrence is displayed on.
When the event's timezone differs from the `displayTimezone`, the Recurrence tab shows a "Timezone: …" note under the recurrence selector and the read-only details append the timezone name to the recurrence label.
An event created from the UI has no `timezone` field, so the note names the system timezone (the `default` one) when the calendar displays another.

{{"demo": "TimezoneRecurringEvents.js", "bg": "inline", "defaultCodeOpen": false}}
