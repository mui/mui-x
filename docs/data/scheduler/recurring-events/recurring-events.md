---
productId: x-scheduler
title: React Scheduler component
packageName: '@mui/x-scheduler'
githubLabel: 'scope: scheduler'
---

# Scheduler - Recurring Events [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

<p class="description">Define recurring events.</p>

{{"component": "@mui/docs/ComponentLinkHeader", "design": false}}

:::warning
This package is not published yet.
:::

You can use the `rrule` property on your event model to define its repeating pattern:

```ts
const event = {
  // ...other properties
  rrule: { freq: 'WEEKLY', interval: 2, byDay: ['TH'] },
};
```

:::success
The `rrule` property also accepts a string value in [RFC 5545 RRULE](https://datatracker.ietf.org/doc/html/rfc5545#section-3.3.10) format.
Internally, string-based rules are automatically parsed into the same object structure shown above,
so both forms are fully equivalent:

```ts
// These two definitions are identical:
rrule: 'FREQ=WEEKLY;INTERVAL=2;BYDAY=TH'
rrule: { freq: 'WEEKLY', interval: 2, byDay: ['TH'] }
```

:::

:::info
**Standards compliance**: This scheduler follows the iCalendar **RRULE** standard from **RFC 5545**. We do not support every rule or combination yet. If you want more information about a specific rule, see **[RFC 5545 §3.3.10 Recurrence Rule](https://datatracker.ietf.org/doc/html/rfc5545#section-3.3.10)**.
:::

The `EventCalendarPremium` and the `EventTimelinePremium` expand recurring events only for the visible range, keeps the original duration and handles all-day and multi-day spans.

{{"demo": "RecurringEventsDataset.js", "bg": "inline", "defaultCodeOpen": false}}

## Frequency and interval

The repeating pattern of an event is defined using an object which expects the following properties:

```ts
export interface SchedulerProcessedEventRecurrenceRule {
  /**
   * Base frequency of the rule.
   * Corresponds to the FREQ property of the string-based RRULE.
   */
  freq: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  /**
   * Positive integer representing at which intervals the recurrence rule repeats.
   * For example, within a DAILY rule, a value of "8" means every eight days.
   * Corresponds to the INTERVAL property of the string-based RRULE.
   * @default 1
   */
  interval?: number;
  // ... other properties like `byDay` or `byMonthDay` that depends on the frequency
  // see the example below or the full SchedulerProcessedEventRecurrenceRule definition for more details
}
```

### Daily frequency

No extra field is required:

```tsx
// Every day
rrule={{ freq: 'DAILY' }}

// Every two days
rrule={{ freq: 'DAILY', interval: 2 }}
```

### Weekly frequency

Use the `byDay` property with plain weekday codes (no ordinal) to define the day(s) of the week on which the event should be applied:

```tsx
// Every week on Monday
rrule={{ freq: 'WEEKLY' }}

// Every two weeks on Monday, Wednesday and Friday
rrule={{ freq: 'WEEKLY', interval: 2, byDay: ['MO', 'WE', 'FR'] }}
```

### Monthly frequency

Use either the `byMonthDay` or the `byDay` property (both can't be defined together):

- Use the `byMonthDay` property with a single day number to define the day of the month on which the event should be applied:

  ```tsx
  // Every month on the 15th
  rrule: { freq: 'MONTHLY', byMonthDay: [15] }

  // Every two months on the 15th
  rrule: { freq: 'MONTHLY', interval: 2, byMonthDay: [15] }
  ```

  :::success
  If a month doesn't contain that day (for example day 30 for February), that month won't contain an occurrence of the event.
  :::

- Use the `byDay` property with a single ordinal entry (`2TU` represents 2nd Tuesday, `-1FR` represents last Friday, etc):

  ```tsx
  // Second Tuesday of every month
  rrule: { freq: 'MONTHLY', interval: 1, byDay: ['2TU'] }

  // Last Friday of every month
  rrule: { freq: 'MONTHLY', interval: 1, byDay: ['-1FR'] }

  // First Monday of every two month
  rrule: { freq: 'MONTHLY', interval: 2, byDay: ['1MO'] }

  ```

### Yearly frequency

No extra field is required:

```tsx
  // Every year on the event's start date (same month and day)
  rrule: { freq: 'YEARLY', interval: 1 }

  // Every two years on the event's start date (same month and day)
  rrule: { freq: 'YEARLY', interval: 2 }
```

:::success
Advanced selectors (`byMonth`, `byMonthDay`, `byDay`) are not supported yet for the yearly frequency.
:::

## End boundary

By default, the event keeps occurrence without ever ending.
Use either the `count` or the `until` property if you want to put an end boundary to your event (both can't be defined together):

- Use the `count` property if you want your event to stop after a given amount of occurrences:

  ```tsx
  // Stop after 5 occurrences
  rrule: { freq: 'DAILY', count: 5 }
  ```

- Use the `until` property if you want your event to stop at a given date:

  ```tsx
  // Until a date (inclusive)
  rrule: { freq: 'WEEKLY', byDay: ['TU'], until: DateTime.fromISO('2025-12-31T23:59:59Z') }
  ```

  :::success
  The `until` property is inclusive. This mean that if it matches the date of an event occurrence, this occurrence will be included.
  :::
