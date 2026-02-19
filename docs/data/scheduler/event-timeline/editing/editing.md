---
productId: x-scheduler
title: React Scheduler component
packageName: '@mui/x-scheduler-premium'
githubLabel: 'scope: scheduler'
---

# Event Timeline - Editing

<p class="description">Configure how events are created and edited.</p>

{{"component": "@mui/docs/ComponentLinkHeader", "design": false}}

:::warning
This package is not published yet.
:::

## Read-only

Use the `readOnly` prop to disable all editing interactions (event creation, drag and drop, resizing, and popover editing):

```tsx
<EventTimelinePremium readOnly />
```

{{"demo": "ReadOnly.js", "bg": "inline", "defaultCodeOpen": false}}

## Only enable on some events

### Per event

Use the `readOnly` property on the event model to mark an event as read-only:

```ts
const event = {
  // ...other properties
  readOnly: true,
};
```

### Per resource

Use the `areEventsReadOnly` property on the resource model to mark all events of a resource as read-only:

```ts
const resource = {
  // ...other properties
  areEventsReadOnly: true,
};
```

### Priority order

The priority order for determining if an event is read-only is:

1. The `readOnly` property assigned to the event

```tsx
<EventTimelinePremium
  events={[{ id: '1', title: 'Event 1', readOnly: true }]}
/>
```

2. The `areEventsReadOnly` property assigned to the event's resource

```tsx
<EventTimelinePremium
  resources={[
    {
      id: '1',
      title: 'Resource 1',
      areEventsReadOnly: true,
    },
  ]}
/>
```

:::success
If one of the properties is not defined on the resource, it checks for the closest ancestor with this property defined.
:::

3. The `readOnly` prop assigned to the Event Timeline

```tsx
<EventTimelinePremium readOnly />
```

For example, with the following code, all "work" events are read-only except `"event-3"`:

```tsx
function App() {
  const resources = [
    { id: 'work', title: 'Work', areEventsReadOnly: true },
    { id: 'personal', title: 'Personal' },
  ];

  const events = [
    { id: 'event-1', resource: 'work' },
    { id: 'event-2', resource: 'personal' },
    { id: 'event-3', resource: 'work', readOnly: false },
  ];

  return <EventTimelinePremium resources={resources} events={events} />;
}
```

## Event creation

Use the `eventCreation` prop to customize how newly created events are defined:

### Disable event creation

Pass `eventCreation={false}` to disable the event creation:

```tsx
<EventTimelinePremium eventCreation={false} />
```

### Custom default duration

Pass a custom value to `eventCreation.duration` to change the default duration of newly created event:

```tsx
<EventTimelinePremium eventCreation={{ duration: 60 }} />
```

{{"demo": "EventCreationDuration.js", "bg": "inline", "defaultCodeOpen": false}}

### Create event on click

Set `eventCreation.interaction` to `"click"` to open the creation form when clicking a cell instead of double-clicking:

```tsx
<EventTimelinePremium eventCreation={{ interaction: 'click' }} />
```

{{"demo": "EventCreationInteraction.js", "bg": "inline", "defaultCodeOpen": false}}
