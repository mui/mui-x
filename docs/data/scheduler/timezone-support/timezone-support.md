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

Scheduler supports displaying events across different timezones by combining:

- Instant-based date values
- An optional `timezone` field on the event model
- A `displayTimezone` used for rendering

The `timezone` field describes the conceptual timezone of the event data and does not reinterpret date values.

This behavior is aligned with common calendar applications such as Google Calendar, Outlook, and Apple Calendar.

## Supported date values

Scheduler currently expects date values to represent a fixed instant in time.

Values must be instant-based and can be projected to different timezones.

Wall-time values such as date strings without timezone information are not supported.

## Rendering behavior

Scheduler always renders events using the `displayTimezone` prop.

Changing the display timezone does not change when the event occurs, only how it is displayed.
