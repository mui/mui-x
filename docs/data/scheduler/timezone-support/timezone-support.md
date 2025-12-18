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

{{"demo": "TimezoneDatasetWalltime.js", "bg": "inline", "defaultCodeOpen": false}}

## Overview

Scheduler supports displaying events across different timezones by combining:

- Date values that may or may not include timezone information
- An optional `timezone` field on the event model
- A `displayTimezone` used for rendering

This behavior is aligned with common calendar applications such as Google Calendar, Outlook, and Apple Calendar.

## Date interpretation rules

When a date value includes timezone information (UTC or an explicit offset), it represents a fixed instant in time.
That instant is converted to the effective timezone, which is the event timezone if provided, or the adapter default timezone otherwise.

When a date value does not include timezone information, it is interpreted as a local time in the effective timezone.

| Date value                    | Includes timezone info | Effective timezone used           | Interpretation                                    |
| ----------------------------- | ---------------------- | --------------------------------- | ------------------------------------------------- |
| `"2025-03-14T02:00:00Z"`      | Yes (UTC)              | Event timezone or adapter default | Fixed instant converted to the effective timezone |
| `"2025-03-14T02:00:00-05:00"` | Yes (UTC-5)            | Event timezone or adapter default | Fixed instant converted to the effective timezone |
| `"2025-03-14T02:00:00"`       | No                     | Event timezone or adapter default | Local time interpreted in the effective timezone  |

The effective timezone is the event timezone when provided, or the adapter default timezone otherwise.

## Rendering behavior

Scheduler always renders events using the `displayTimezone` prop.

Changing the display timezone does not change when the event occurs, only how it is displayed.

## Adapter considerations

The exact behavior for certain date formats depends on the temporal adapter in use.

In particular, support for date strings with explicit timezone offsets may vary between adapters.

For consistent behavior across environments:

- Prefer ISO strings with `Z` for instant-based dates.
- Always provide an event `timezone` when using wall-time-based dates.
