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

You can enable the dragging and resizing of events within the Event Calendar or the Timeline Premium using the `areEventsDraggable` and `areEventsResizable` props.
When `areEventsDraggable` is `true`, the events can be dragged to another point in time.
When `areEventsResizable` is `true`, the event extremities can be dragged to change its duration.

### Basic Event Calendar

{{"demo": "EventCalendarDragAndDrop.js", "bg": "inline", "defaultCodeOpen": false}}

### Basic Timeline Premium

{{"demo": "EventTimelinePremiumDragAndDrop.js", "bg": "inline", "defaultCodeOpen": false}}

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

### Only allow dragging and resizing events of some resources

You can enable the dragging and resizing for all events of a specific resource using the `areEventsDraggable` and `areEventsResizable` properties on the resource.

```tsx
const resources = [
  {
    id: 'work',
    title: 'Work',
    areEventsDraggable: true,
    areEventsResizable: true,
  },
  {
    id: 'birthdays',
    title: 'Birthdays',
  },
];
```

In the example below, only "Work" events (and its children: "eXplore Team", "Data Grid Team", etc.) can be dragged and resized:

{{"demo": "DragAndDropResourceLevel.js", "bg": "inline", "defaultCodeOpen": false}}

### Priority order

The priority order for determining if an event is draggable or resizable is:

1. **Event-level**: The `draggable` and `resizable` properties on the event take the highest precedence.
2. **Resource-level**: The `areEventsDraggable` and `areEventsResizable` properties on the resource are checked next. If the property is not defined on the resource, it checks the parent resource, and so on up the hierarchy.
3. **Component-level**: The `areEventsDraggable` and `areEventsResizable` props on the component are used as the final fallback.

With the following code, all "work" events are draggable except `"event-3"`:

```tsx
function App() {
  const resources = [
    { id: 'work', title: 'Work', areEventsDraggable: true },
    { id: 'personal', title: 'Personal' },
  ];

  const events = [
    { id: 'event-1', resource: 'work' },
    { id: 'event-2', resource: 'personal' },
    { id: 'event-3', resource: 'work', draggable: false },
  ];

  return <EventCalendar resources={resources} events={events} />;
}
```

### Only allow resizing one side

You can enable the resizing only for one side of your events by setting the `areEventsResizable` to `"start"` or `"end"`:

```tsx
<EventCalendar areEventsResizable="end" />
```

{{"demo": "DragAndDropResizeEnd.js", "bg": "inline", "defaultCodeOpen": false}}

:::success
The `draggable` event property also supports `"start"` and `"end"`.
With the following code, all events are resizable, but `"event-3"` is only resizable from the end:

```tsx
function App() {
  const events = [
    { id: 'event-1' },
    { id: 'event-2' },
    { id: 'event-3', resizable: 'end' },
  ];

  return <EventCalendar areEventsResizable events={events} />;
}
```

:::

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

### Basic Timeline Premium

{{"demo": "EventTimelinePremiumExternalDragAndDrop.js", "bg": "inline", "defaultCodeOpen": false}}
