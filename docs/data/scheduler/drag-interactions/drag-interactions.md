---
productId: x-scheduler
title: React Scheduler component
packageName: '@mui/x-scheduler'
githubLabel: 'scope: scheduler'
---

# Scheduler - Drag Interaction

<p class="description">Re-scheduler or resize your events using drag and drop.</p>

{{"component": "@mui/docs/ComponentLinkHeader", "design": false}}

:::warning
This package is not published yet.
:::

## Drag and resize events

You can enable the dragging and resizing of events within the Event Calendar or the Timeline using the `areEventsDraggable` and `areEventsResizable` props.
When `areEventsDraggable` is `true`, the events can be dragged to another point in time.
When `areEventsResizable` is `true`, the event extremities can be dragged to change its duration.

### Basic Event Calendar

{{"demo": "EventCalendarDragAndDrop.js", "bg": "inline", "defaultCodeOpen": false}}

### Basic Timeline

{{"demo": "TimelineDragAndDrop.js", "bg": "inline", "defaultCodeOpen": false}}

### Only allow resizing one side

{{"demo": "DragAndDropResizeStart.js", "bg": "inline", "defaultCodeOpen": false}}

## External drag and drop

You can enable the dragging from and to the outside of the Event Calendar using the `canDragEventsFromTheOutside` and `canDropEventsToTheOutside` props.
When `canDragEventsFromTheOutside` is `true`, the events created with `<StandaloneEvent />` can be dropped inside the Event Calendar.
When `canDropEventsToTheOutside` is `true`, the events from within the Event Calendar can be dropped outside of it.

:::success
To be able to drag an event to the outside, your events must be draggable, so `areEventsDraggable` must be `true`.
:::

### Basic Event Calendar

{{"demo": "EventCalendarExternalDragAndDrop.js", "bg": "inline", "defaultCodeOpen": false}}

### Basic Timeline

{{"demo": "TimelineExternalDragAndDrop.js", "bg": "inline", "defaultCodeOpen": false}}
