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

Scheduler supports displaying and editing events across different timezones using an
**instant-based model**.

Each event occurrence represents a fixed moment in time (an instant), which can be rendered
in different timezones without changing when the event actually happens.

In addition to instant-based date values, events may define an optional `timezone` field.
This field represents the **conceptual timezone of the event**, and is used for:

- Recurring event rules (RRULE)
- Daylight Saving Time calculations

The `timezone` field does **not** reinterpret or shift date values by itself.

## Supported date values

Scheduler works with **adapter-defined temporal objects**.

All date values (`start`, `end`, etc.) are instances of
`TemporalSupportedObject`, whose concrete type depends on the active date adapter.

These objects are expected to represent **fixed instants in time**, independently
of how they are rendered or serialized.

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
