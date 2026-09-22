---
productId: x-scheduler
title: React Scheduler component
packageName: '@mui/x-scheduler'
githubLabel: 'scope: scheduler'
components: EventCalendar, EventCalendarPremium
---

# Event Calendar - Drag Interactions

<p class="description">Reschedule or resize your events using drag-and-drop interactions.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader", "design": false}}

You can move events to a different time slot by dragging them, and resize them by dragging their start or end edge.
Both are enabled by default:

{{"demo": "BasicDragAndDrop.js", "bg": "inline", "defaultCodeOpen": false}}

## Disable event dragging

Use the `areEventsDraggable` property to prevent dragging events to a different time slot:

```tsx
<EventCalendar areEventsDraggable={false} />
```

{{"demo": "DisableDragging.js", "bg": "inline"}}

## Disable event resizing

Use the `areEventsResizable` property to prevent resizing events by dragging their start or end edge:

```tsx
<EventCalendar areEventsResizable={false} />
```

{{"demo": "DisableResizing.js", "bg": "inline"}}

:::success
Set the `areEventsResizable` property to `"start"` or `"end"` to enable resizing only for one side:

```tsx
<EventCalendar areEventsResizable="end" />
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
<EventCalendar
  events={[{ id: '1', title: 'Event 1', draggable: false, resizable: false }]}
/>
```

2. The `areEventsDraggable` and `areEventsResizable` properties assigned to the event's resource

```tsx
<EventCalendar
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

3. The `areEventsDraggable` and `areEventsResizable` props assigned to the Event Calendar

```tsx
<EventCalendar areEventsDraggable={false} areEventsResizable={false} />
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

  return <EventCalendar resources={resources} events={events} />;
}
```

## External drag and drop

Use the `canDragEventsFromTheOutside` and `canDropEventsToTheOutside` props to drag events between the Event Calendar and external containers.
When `canDragEventsFromTheOutside` is `true`, you can drop external draggables using `schedulerExternalEventKind` into the Event Calendar.
When `canDropEventsToTheOutside` is `true`, you can drag events out of the Event Calendar.

Create external items with the Base UI drag engine and the Scheduler's exported kind:

```tsx
import { Draggable } from '@base-ui/react/draggable';
import { schedulerExternalEventKind } from '@mui/x-scheduler/drag-and-drop';

<Draggable.Provider>
  <Draggable.Root
    kind={schedulerExternalEventKind}
    payload={{
      eventData: { id: 'task-1', title: 'Planning', duration: 60 },
      onEventDrop: () => removeFromExternalList('task-1'),
    }}
  >
    Planning
  </Draggable.Root>
</Draggable.Provider>;
```

`eventData` contains the event properties and an optional duration in minutes.
The Scheduler supplies the dates and destination resource from the drop position.
The optional `onEventDrop` callback runs after the Scheduler handles the drop; use it to remove the item from the external list.
Keep this callback in the payload: the source's `onMoveEnd` runs before the Scheduler's drop handler.

A provider can wrap the whole external list.
External sources and the Scheduler can use separate providers because the exported kind is shared.
Use the exported kind directly rather than creating a new kind with the same name.

The example above uses the engine's default floating preview.
For a custom preview, use `Draggable.Preview`.
The demo below uses `Draggable.useDragMonitor` and `schedulerDropTargetKind.matches(target)` to hide that preview over Scheduler targets.
The Scheduler renders its own in-grid previews, including events that span multiple days or weeks.
Styling and focus or button behavior belong to your external component.

{{"demo": "ExternalDragAndDrop.js", "bg": "inline", "defaultCodeOpen": false}}
