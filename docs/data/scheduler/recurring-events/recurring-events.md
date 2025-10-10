---
productId: x-scheduler
title: React Scheduler component
packageName: '@mui/x-scheduler'
githubLabel: 'scope: scheduler'
---

# Scheduler - Recurring Events

<p class="description">Define recurring events.</p>

{{"component": "@mui/docs/ComponentLinkHeader", "design": false}}

:::warning
This package is not published yet.
:::

You can use the `rrule` property on your event model to define its repeating pattern:

```ts
const event = {
  // ...other even properties
  rrule: { freq: 'WEEKLY', interval: 2, byDay: ['TH'] },
};
```

The scheduler expands recurring events only for the visible range, keeps the original duration and handles all-day and multi-day spans.

{{"demo": "Recurrence.js", "bg": "inline", "defaultCodeOpen": false}}

## Supported recurrence patterns

We use a typed object (`RRuleSpec`) instead of the raw RRULE string, but it mirrors a subset of the iCalendar RRULE (RFC 5545).

In the `rrule` object, `freq` sets the base frequency of the pattern: `'DAILY'` | `'WEEKLY'` | `'MONTHLY'` | `'YEARLY'`.
Besides, `interval` is the step between occurrences (defaults to 1) and selectors are optional filters like `byDay` or `byMonthDay`, that refine the base frequency.

Below are the shapes we support, with small examples.

- Daily (`freq: 'DAILY'`), no extra fields required.

  ```tsx
  // Every 2 days
  rrule={{ freq: 'DAILY', interval: 2 }}
  ```

- Weekly (`freq: 'WEEKLY'`), use `byDay` with plain weekday codes (no ordinals).

  ```tsx
  // Every week on Monday, Wednesday and Friday
  rrule={{ freq: 'WEEKLY', interval: 1, byDay: ['MO', 'WE', 'FR'] }}
  ```

- Monthly (`freq: 'MONTHLY'`), pick one mode:
  - `byMonthDay` with a single day number (months missing that day are skipped).

    ```tsx
    // Every month on the 15th
    rrule: { freq: 'MONTHLY', interval: 1, byMonthDay: [15] }
    ```

  - `byDay` with one ordinal entry (`2TU` represents 2nd Tuesday, `-1FR` represents last Friday, etc).
    Do not mix with `byMonthDay`.

    ```tsx
    // Second Tuesday of every month
    rrule: { freq: 'MONTHLY', interval: 1, byDay: ['2TU'] }

    // Last Friday of every month
    rrule: { freq: 'MONTHLY', interval: 1, byDay: ['-1FR'] }

    ```

- Yearly (`freq: 'YEARLY'`), repeats each year on the same calendar date (month and day) as the event's start. Advanced selectors (`byMonth`, `byMonthDay`, `byDay`) are not supported yet.

  ```tsx
  // Every year on the event's start date
  rrule: { freq: 'YEARLY', interval: 1 }
  ```

- End of rule, use `count` or `until` (inclusive), only one at a time. If neither `count` nor `until` is provided, the series never ends.

  ```tsx
  // Never ends (default)
  rrule: { freq: 'DAILY', interval: 1 }

  // Stop after 5 occurrences
  rrule: { freq: 'DAILY', count: 5 }

  // Until a date (inclusive)
  rrule: { freq: 'WEEKLY', byDay: ['TU'], until: DateTime.fromISO('2025-12-31T23:59:59Z') }
  ```

:::info
**Standards compliance**: This scheduler follows the iCalendar **RRULE** standard from **RFC 5545**. We do not support every rule or combination yet. If you want more information about a specific rule, see **[RFC 5545 §3.3.10 Recurrence Rule](https://datatracker.ietf.org/doc/html/rfc5545#section-3.3.10)**.
:::
