---
productId: x-scheduler
title: React Scheduler component
packageName: '@mui/x-scheduler'
githubLabel: 'scope: scheduler'
---

# Event Calendar - Drag Interaction

<p class="description">Re-scheduler or resize your events using drag and drop.</p>

{{"component": "@mui/docs/ComponentLinkHeader", "design": false}}

:::warning
This package is not published yet.
:::

{{"demo": "BasicDragAndDrop.js", "bg": "inline", "defaultCodeOpen": false}}

## Enable event dragging

Use the `areEventsDraggable` property to allow dragging events to another point in time:

```tsx
<EventCalendar areEventsDraggable />
```

{{"demo": "AreEventsDraggable.js", "bg": "inline"}}

## Enable event resizing

Use the `areEventsResizable` property to allow resizing events by dragging their start or end edge:

```tsx
<EventCalendar areEventsResizable />
```

{{"demo": "AreEventsResizable.js", "bg": "inline"}}

:::success
Set the `areEventsResizable` property to `"start"` or `"end"` to enable resizing only for one side:

```tsx
<EventCalendar areEventsResizable="end" />
```

:::

:::success
For now, the editing form is not customizable, but in the future devs should be able to apply the same logic there.
:::

## Only enable on some events

### Per event

Use the `draggable` property on the event model to mark an event as draggable to another point in time:

```ts
const event = {
  // ...other properties
  draggable: true,
};
```

Use the `resizable` property on the event model to mark an event as resizable by dragging it's start or end edge:

```ts
const event = {
  // ...other properties
  resizable: true,
  resizable: "start" // only the start edge is draggable.
  resizable: "end" // only the end edge is draggable.
};
```

### Per resource

Use the `areEventsDraggable` property on the resource model to allow dragging a resource's events to another point in time:

```ts
const resource = {
  // ...other properties
  areEventsDraggable: true,
};
```

Use the `areEventsResizable` property on the resource model to allow resizing a resource's events by dragging their start or end edge:

```ts
const resource = {
  // ...other properties
  areEventsResizable: true,
  areEventsResizable: "start" // only the start edge is draggable.
  areEventsResizable: "end" // only the end edge is draggable.
};
```

### Priority order

The priority order for determining if an event is draggable or resizable is:

1. The `draggable` and `resizable` properties assigned to the event

```tsx
<EventCalendar
  events={[{ id: '1', title: 'Event 1', draggable: true, resizable: true }]}
/>
```

2. The `areEventsDraggable` and `areEventsResizable` properties assigned to the event's resource

```tsx
<EventCalendar
  resources={[
    {
      id: '1',
      title: 'Resource 1',
      areEventsDraggable: true,
      areEventsResizable: true,
    },
  ]}
/>
```

:::success
If one of the properties is not defined on the resource, it checks for the closest ancestor with this property defined.
:::

3. The `areEventsDraggable` and `areEventsResizable` props assigned to the Event Calendar

```tsx
<EventCalendar areEventsDraggable areEventsResizable />
```

For example, with the following code, all "work" events are draggable except `"event-3"`:

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

## External drag and drop

You can enable the dragging from and to the outside of the Event Calendar using the `canDragEventsFromTheOutside` and `canDropEventsToTheOutside` props.
When `canDragEventsFromTheOutside` is `true`, the events created with `<StandaloneEvent />` can be dropped inside the Event Calendar.
When `canDropEventsToTheOutside` is `true`, the events from within the Event Calendar can be dropped outside of it.

:::success
To be able to drag an event to the outside, your events must be draggable, so `areEventsDraggable` must be `true`.
:::

{{"demo": "ExternalDragAndDrop.js", "bg": "inline", "defaultCodeOpen": false}}
