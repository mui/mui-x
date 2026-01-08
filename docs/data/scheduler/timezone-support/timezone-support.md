---
productId: x-scheduler
title: React Scheduler component
packageName: '@mui/x-scheduler'
githubLabel: 'scope: scheduler'
---

# Scheduler - Timezone Support

<p class="description">Display events correctly across different timezones.</p>

{{"component": "@mui/docs/ComponentLinkHeader", "design": false}}

:::warning
This package is not published yet.
:::

TODO: Issue #20394 - Create documentation and demos

{{"demo": "TimezoneDatasetInstantBased.js", "bg": "inline", "defaultCodeOpen": false}}

## Overview

Scheduler supports displaying and editing events across different timezones by treating
event dates as fixed moments in time.

An event always represents the same moment, regardless of the timezone in which it is
displayed. Changing the timezone only affects how the date is shown to the user, not when
the event actually happens.

Events can optionally define a `timezone` field. This field is metadata and does not
reinterpret or shift the event start or end dates.

The `timezone` field is only used in situations where wall-time matters, such as:

- Recurring event rules (RRULE)
- Daylight Saving Time calculations

## Event date values

The `start` and `end` fields of an event must represent a fixed moment in time.

They are expected to be provided as JavaScript `Date` objects or timezone-aware
date objects (such as `TZDate`).

:::info
The timezone of the date object itself is not used to define event semantics.
Only the instant it represents is taken into account.
:::

## Rendering behavior

Scheduler always renders events using the `displayTimezone` prop.

Changing the display timezone does not change when an event occurs,
only how that instant is presented to the user. The underlying event data remains unchanged.

## Recurring events and timezones

While single events are updated using pure instants, recurring events define
a **pattern** that is evaluated in a specific timezone.

When updating occurrences of a recurring event, Scheduler interprets the edited
occurrence in the event's `timezone` in order to update the recurring rule correctly.

This is the only case where Scheduler intentionally operates on day/hour semantics
instead of pure instants.

:::info
Recurring event updates are pattern-based.
This is the only case where Scheduler intentionally operates on wall-time semantics
instead of pure instants.
:::

## What Scheduler does not support yet

Scheduler currently does not support wall-time event definitions based on string dates.

This means:

- Dates without an explicit instant (for example `"2024-03-10 09:00"`) are not supported
- Event dates are not reinterpreted based on `event.timezone`

Support for string-based, wall-time event definitions is planned for a future release.
