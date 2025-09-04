---
productId: x-scheduler
title: React Scheduler component
packageName: '@mui/x-scheduler'
githubLabel: 'scope: scheduler'
---

# Scheduler - Overview

<p class="description">A collection of primitives following the principles of Base UI to create custom event calendar UIs.</p>

{{"component": "@mui/docs/ComponentLinkHeader", "design": false}}

:::warning
This package is not published yet.
:::

## Time Grid

### Basic example

{{"demo": "TimeGridPrimitive.js", "bg": "inline", "defaultCodeOpen": false}}

### Start and end time

{{"demo": "TimeGridPrimitiveStartEndTime.js", "bg": "inline", "defaultCodeOpen": false}}

### Drag and drop

- Add the `isDraggable` prop to the `TimeGrid.Event` part to enable the re-scheduling of the events
- Render a `TimeGrid.EventResizeHandler` inside the `TimeGrid.Event` part to enable the resizing of the events
- Use the `TimeGrid.useColumnPlaceholder()` to render a placeholder of the event being dragged

{{"demo": "TimeGridPrimitiveDragAndDrop.js", "bg": "inline", "defaultCodeOpen": false}}

### Drag and drop to update resource

- Add a `columnId` to the `TimeGrid.Column` part to identify which column the event is being dropped inside of

{{"demo": "TimeGridPrimitiveDragAndDropResource.js", "bg": "inline", "defaultCodeOpen": false}}

## Day Grid

### Basic example

{{"demo": "DayGridPrimitive.js", "bg": "inline", "defaultCodeOpen": false}}

### Drag and drop

- Add the `isDraggable` prop to the `DayGrid.Event` part to enable the re-scheduling of the events
- Use the `DayGrid.usePlaceholderInDay()` to render a placeholder of the event being dragged

{{"demo": "DayGridPrimitiveDragAndDrop.js", "bg": "inline", "defaultCodeOpen": false}}

## Timeline

### Basic example

{{"demo": "TimelinePrimitive.js", "bg": "inline", "defaultCodeOpen": false}}
