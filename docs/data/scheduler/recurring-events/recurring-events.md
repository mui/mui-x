---
productId: x-scheduler
title: React Scheduler component
packageName: '@mui/x-scheduler'
githubLabel: 'scope: scheduler'
---

# Scheduler - Recurring Events [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

<p class="description">Use RRULE strings to create repeating events with daily, weekly, monthly, or yearly patterns.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader", "design": false}}

You can use the `rrule` property on your event model to define its repeating pattern using the [RFC 5545 RRULE](https://datatracker.ietf.org/doc/html/rfc5545#section-3.3.10) string format:

```ts
const event = {
  // ...other properties
  rrule: 'FREQ=WEEKLY;INTERVAL=2;BYDAY=TH',
};
```

:::success
The `rrule` property also accepts an object value.
Internally, both forms are automatically parsed into the same structure,
so they are fully equivalent:

```ts
// These two definitions are identical:
rrule: 'FREQ=WEEKLY;INTERVAL=2;BYDAY=TH'
rrule: { freq: 'WEEKLY', interval: 2, byDay: ['TH'] }
```

:::

:::info
**Standards compliance**: This scheduler follows the iCalendar RRULE standard from RFC 5545.
It does not support every rule or combination yet.
For more information about specific rules, see [RFC 5545 §3.3.10 Recurrence Rule](https://datatracker.ietf.org/doc/html/rfc5545#section-3.3.10).
:::

Recurring events are opt-in: pass the `recurringEvents` feature to the `features` prop of `EventCalendarPremium`, of its standalone views, or of `EventTimelinePremium`.
Without it, each event with an `rrule` renders once, as a single event, and the recurrence code stays out of your bundle.

```tsx
import { EventCalendarPremium } from '@mui/x-scheduler-premium/event-calendar-premium';
import { recurringEventsFeature } from '@mui/x-scheduler-premium/recurring-events';

<EventCalendarPremium features={{ recurringEvents: recurringEventsFeature }} />;
```

:::info
The `features` prop is read once, when the component mounts.
To change it, remount the component, for example with a `key`.
:::

:::warning
Without the feature, the `rrule` stays in your data but is ignored:

- The event renders once, on its start date, even when that occurrence was deleted or edited on its own (the `exDates` are not applied).
- The event dialog has no Recurrence tab, and no dialog asks which occurrences a change applies to.
- Editing, moving, or deleting the event applies to the event stored in your data, which is the whole series.

:::

With the feature, the Scheduler expands recurring events only for the visible range, keeps the original duration, and handles all-day and multi-day spans.

The rule is evaluated in the event's `timezone`, even when it is edited from the event dialog while the calendar displays another timezone.
See [Recurring events and timezones](/x/react-scheduler/timezone/#recurring-events-and-timezones) for details.

{{"demo": "RecurringEventsDataset.js", "bg": "inline", "defaultCodeOpen": false}}

## Frequency and interval

The RRULE string is composed of semicolon-separated `KEY=VALUE` pairs.
The two fundamental properties are:

- `FREQ`: the base frequency of the rule: `DAILY`, `WEEKLY`, `MONTHLY`, or `YEARLY`.
- `INTERVAL` _(optional, defaults to `1`)_: at which intervals the recurrence repeats, as a positive integer.
  For example, within a `DAILY` rule, a value of `8` means every eight days.

### Daily frequency

No extra property is required:

```ts
// Every day
rrule: 'FREQ=DAILY';

// Every two days
rrule: 'FREQ=DAILY;INTERVAL=2';
```

### Weekly frequency

Use the `BYDAY` property with plain weekday codes (no ordinal) to define the day(s) of the week on which the event should be applied:

```ts
// Every week on Monday
rrule: 'FREQ=WEEKLY;BYDAY=MO';

// Every two weeks on Monday, Wednesday and Friday
rrule: 'FREQ=WEEKLY;INTERVAL=2;BYDAY=MO,WE,FR';
```

### Monthly frequency

Use either the `BYMONTHDAY` or the `BYDAY` property (both can't be defined together):

- Use the `BYMONTHDAY` property with a single day number, from 1 to 31, to define the day of the month on which the event should be applied:

  ```ts
  // Every month on the 15th
  rrule: 'FREQ=MONTHLY;BYMONTHDAY=15';

  // Every two months on the 15th
  rrule: 'FREQ=MONTHLY;INTERVAL=2;BYMONTHDAY=15';
  ```

  :::success
  If a month doesn't contain that day (for example day 30 for February), that month won't contain an occurrence of the event.
  :::

- Use the `BYDAY` property with a single ordinal entry (`2TU` represents 2nd Tuesday, `-1FR` represents last Friday, etc):

  ```ts
  // Second Tuesday of every month
  rrule: 'FREQ=MONTHLY;BYDAY=2TU';

  // Last Friday of every month
  rrule: 'FREQ=MONTHLY;BYDAY=-1FR';

  // First Monday of every two months
  rrule: 'FREQ=MONTHLY;INTERVAL=2;BYDAY=1MO';
  ```

### Yearly frequency

No extra property is required:

```ts
// Every year on the event's start date (same month and day)
rrule: 'FREQ=YEARLY';

// Every two years on the event's start date (same month and day)
rrule: 'FREQ=YEARLY;INTERVAL=2';
```

:::success
Advanced selectors (`BYMONTH`, `BYMONTHDAY`, `BYDAY`) are not supported yet for the yearly frequency.
:::

## End boundary

By default, the event keeps recurring without ever ending.
Use either the `COUNT` or the `UNTIL` property if you want to put an end boundary to your event (both can't be defined together):

- Use the `COUNT` property if you want your event to stop after a given amount of occurrences:

  ```ts
  // Stop after 5 occurrences
  rrule: 'FREQ=DAILY;COUNT=5';
  ```

- Use the `UNTIL` property if you want your event to stop at a given date.
  Use `YYYYMMDD` for a date, or `YYYYMMDDTHHmmssZ` for a UTC date-time (no dashes or colons):

  ```ts
  // Until December 31, 2025, included
  rrule: 'FREQ=WEEKLY;BYDAY=TU;UNTIL=20251231';

  // Until December 31, 2025 at 09:00 UTC (inclusive)
  rrule: 'FREQ=WEEKLY;BYDAY=TU;UNTIL=20251231T090000Z';
  ```

  :::success
  The `UNTIL` property is inclusive, and is read in the timezone of the event.
  A date includes its whole day.
  For timed events, a UTC date-time is the exact cutoff: an occurrence starting at that instant is included, and one starting later is excluded.
  For all-day events, only the date of a UTC date-time in the timezone of the event is used: `UNTIL=20251231T235959Z` ends an all-day series in `Asia/Tokyo` on January 1, 2026.
  The event dialog offers a date picker: the chosen day is the last day of the series.
  :::
