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

You can enable the dragging from and to the outside of the Timeline using the `canDragEventsFromTheOutside` and `canDropEventsToTheOutside` props.
When `canDragEventsFromTheOutside` is `true`, the events created with `<StandaloneEvent />` can be dropped inside the Timeline.
When `canDropEventsToTheOutside` is `true`, the events from within the Timeline can be dropped outside of it.

:::success
To be able to drag an event to the outside, your events must be draggable, so `areEventsDraggable` must be `true`.
:::

{{"demo": "ExternalDragAndDrop.js", "bg": "inline", "defaultCodeOpen": false}}

## Customization

### Preferences

You can customize the Timeline with the preferences prop.

Available properties:

- `ampm`: Sets the initial time format. `true` uses 12-hour (AM/PM), `false` uses 24-hour. Defaults to `true`.
