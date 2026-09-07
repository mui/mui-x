---
productId: x-scheduler
title: React Scheduler component
packageName: '@mui/x-scheduler'
githubLabel: 'scope: scheduler'
components: EventTimelinePremium
---

# Event Timeline - Drag Interactions

<p class="description">Reschedule or resize your events using drag-and-drop interactions.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader", "design": false}}

You can move events to a different time slot by dragging them, and resize them by dragging their start or end edge.
Both are enabled by default:

{{"demo": "BasicDragAndDrop.js", "bg": "inline", "defaultCodeOpen": false}}

## Disable event dragging

Use the `areEventsDraggable` property to prevent dragging events to a different time slot:

```tsx
<EventTimelinePremium areEventsDraggable={false} />
```

{{"demo": "DisableDragging.js", "bg": "inline"}}

## Disable event resizing

Use the `areEventsResizable` property to prevent resizing events by dragging their start or end edge:

```tsx
<EventTimelinePremium areEventsResizable={false} />
```

{{"demo": "DisableResizing.js", "bg": "inline"}}

:::success
Set the `areEventsResizable` property to `"start"` or `"end"` to enable resizing only for one side:

```tsx
<EventTimelinePremium areEventsResizable="end" />
```

:::

:::info
The editing form isn't customizable yet, but you'll be able to apply the same logic there in a future release.
:::

## Only disable on some events

### Per event

Use the `draggable` property on the event model to prevent an event from being dragged to a different time slot:

```ts
const event = {
  // ...other properties
  draggable: false,
};
```

Use the `resizable` property on the event model to prevent an event from being resized by dragging its start or end edge:

```ts
const event = {
  // ...other properties
  resizable: false,
};
```

### Per resource

Use the `areEventsDraggable` property on the resource model to prevent dragging a resource's events to a different time slot:

```ts
const resource = {
  // ...other properties
  areEventsDraggable: false,
};
```

Use the `areEventsResizable` property on the resource model to prevent resizing a resource's events by dragging their start or end edge:

```ts
const resource = {
  // ...other properties
  areEventsResizable: false,
};
```

### Priority order

The priority order for drag and resize behavior is:

1. The `draggable` and `resizable` properties assigned to the event

```tsx
<EventTimelinePremium
  events={[{ id: '1', title: 'Event 1', draggable: false, resizable: false }]}
/>
```

2. The `areEventsDraggable` and `areEventsResizable` properties assigned to the event's resource

```tsx
<EventTimelinePremium
  resources={[
    {
      id: '1',
      title: 'Resource 1',
      areEventsDraggable: false,
      areEventsResizable: false,
    },
  ]}
/>
```

:::success
If a property isn't defined on the resource, the closest ancestor resource with that property defined takes precedence.
:::

3. The `areEventsDraggable` and `areEventsResizable` props assigned to the Event Timeline

```tsx
<EventTimelinePremium areEventsDraggable={false} areEventsResizable={false} />
```

For example, with the following code, all "work" events are not draggable except `"event-3"`:

```tsx
function App() {
  const resources = [
    { id: 'work', title: 'Work', areEventsDraggable: false },
    { id: 'personal', title: 'Personal' },
  ];

  const events = [
    { id: 'event-1', resource: 'work' },
    { id: 'event-2', resource: 'personal' },
    { id: 'event-3', resource: 'work', draggable: true },
  ];

  return <EventTimelinePremium resources={resources} events={events} />;
}
```

## External drag and drop

Use the `canDragEventsFromTheOutside` and `canDropEventsToTheOutside` props to drag events between the Event Timeline and external containers.
When `canDragEventsFromTheOutside` is `true`, you can drop events created with `StandaloneEvent` into the Event Timeline.
When `canDropEventsToTheOutside` is `true`, you can drag events out of the Event Timeline.

{{"demo": "ExternalDragAndDrop.js", "bg": "inline", "defaultCodeOpen": false}}
