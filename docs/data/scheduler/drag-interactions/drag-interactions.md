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

### Only allow dragging and resizing some events

You can enable the dragging and resizing only on some events using the `draggable` and `resizable` properties on these events.

```tsx
const event = {
  // ...other even properties
  draggable: true,
  resizable: true,
};
```

In the example below, only the "Lunch" event on Tuesday is draggable and resizable:

{{"demo": "DragAndDropSomeEvents.js", "bg": "inline", "defaultCodeOpen": false}}

:::success
The `draggable` and `resizable` event properties take precedence over `areEventsDraggable` and `areEventsResizable`.
You can enable dragging on all events but some as follow:

```tsx
function App() {
  const events = [
    { id: 'event-1' },
    { id: 'event-2' },
    { id: 'event-3', draggable: false, resizable: false },
  ];

  return (
    <EventCalendar
      areEventsDraggable
      areEventsResizable
      events={events} // All events will be draggable and resizable, except event-3
    />
  );
}
```

:::

### Only allow resizing one side

```tsx
const event = {
  // ...other even properties
  resizable: 'end',
};
```

In the example below, only the end of the event can be resized:

{{"demo": "DragAndDropResizeStart.js", "bg": "inline", "defaultCodeOpen": false}}

:::success
For now, the editing form is not customizable, but in the future devs should be able to apply the same logic there.
:::

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
