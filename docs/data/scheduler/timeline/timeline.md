---
productId: x-scheduler
title: React Scheduler component
packageName: '@mui/x-scheduler'
githubLabel: 'scope: scheduler'
---

# Scheduler - Timeline

<p class="description">The Timeline component lets users manage events in a timeline layout.</p>

{{"component": "@mui/docs/ComponentLinkHeader", "design": false}}

:::warning
This package is not published yet.
:::

## Basic example

{{"demo": "BasicTimeline.js", "bg": "inline", "defaultCodeOpen": false}}

## Drag interactions

### Drag and resize events

You can enable the dragging and resizing of events within the Timeline using the `areEventsDraggable` and `areEventsResizable` props.
When `areEventsDraggable` is `true`, the events can be dragged to another point in time.
When `areEventsResizable` is `true`, the event extremities can be dragged to change its duration.

{{"demo": "DragAndDrop.js", "bg": "inline", "defaultCodeOpen": false}}

### External drag and drop

:::success
Not available yet.
:::

## Customization

### Preferences

You can customize the Timeline with the preferences prop.

Available properties:

- `ampm`: Sets the initial time format. `true` uses 12-hour (AM/PM), `false` uses 24-hour. Defaults to `true`.
