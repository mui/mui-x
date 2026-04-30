---
productId: x-scheduler
title: React Scheduler component
packageName: '@mui/x-scheduler'
githubLabel: 'scope: scheduler'
components: EventTimelinePremium
---

# Event Timeline - Drag Interaction

<p class="description">Re-schedule or resize your events using drag and drop.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader", "design": false}}

Events can be moved to a different time slot by dragging them, and resized by dragging their start or end edge.
Both behaviors are enabled by default:

{{"demo": "BasicDragAndDrop.js", "bg": "inline", "defaultCodeOpen": false}}

## Disable event dragging

Use the `areEventsDraggable` property to prevent dragging events to another point in time:

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
Currently the editing form is not customizable, but in the future you'll be able to apply the same logic there.
:::

## Only disable on some events

### Per event

Use the `draggable` property on the event model to prevent an event from being dragged to another point in time:

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

Use the `areEventsDraggable` property on the resource model to prevent dragging a resource's events to another point in time:

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

The priority order for determining if an event is draggable or resizable is:

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
If one of the properties is not defined on the resource, it checks for the closest ancestor with this property defined.
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

You can enable dragging events from and to the outside of the Event Timeline using the `canDragEventsFromTheOutside` and `canDropEventsToTheOutside` props.
When `canDragEventsFromTheOutside` is `true`, you can drop events created with `StandaloneEvent` inside the Event Timeline.
When `canDropEventsToTheOutside` is `true`, you can drop events from within the Event Timeline outside of it.

{{"demo": "ExternalDragAndDrop.js", "bg": "inline", "defaultCodeOpen": false}}
