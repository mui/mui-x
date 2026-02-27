---
productId: x-scheduler
title: React Scheduler component
packageName: '@mui/x-scheduler'
githubLabel: 'scope: scheduler'
---

# Event Calendar - Editing

<p class="description">Configure how events are created and edited.</p>

{{"component": "@mui/docs/ComponentLinkHeader", "design": false}}

:::warning
This package is not published yet.
:::

## Event creation

Use the `eventCreation` prop to customize how newly created events are defined:

### Disable event creation

Pass `eventCreation={false}` to disable the event creation:

```tsx
<EventCalendar eventCreation={false} />
```

### Custom default duration

Pass a custom value to `eventCreation.duration` to change the default duration of newly created event:

```tsx
<EventCalendar eventCreation={{ duration: 60 }} />
```

{{"demo": "EventCreationDuration.js", "bg": "inline", "defaultCodeOpen": false}}

### Create event on click

Set `eventCreation.interaction` to `"click"` to open the creation form when clicking a cell instead of double-clicking:

```tsx
<EventCalendar eventCreation={{ interaction: 'click' }} />
```

{{"demo": "EventCreationInteraction.js", "bg": "inline", "defaultCodeOpen": false}}

## Event dialog

Clicking an event or creating a new one opens the **Event Dialog** — a built-in modal for editing event details.

The dialog has two tabs:

- **General** — edit the title, start/end date and time, toggle all-day, pick a resource and color, and add a description.
- **Recurrence** — set the frequency, interval, days of the week, and end condition for recurring events. This tab is only available when using the Premium package (`@mui/x-scheduler-premium`).

The dialog footer contains **Delete** and **Save Changes** buttons.

Click on any event in the demo below to open the dialog:

{{"demo": "EventDialog.js", "bg": "inline", "defaultCodeOpen": false}}

:::info
When an event has `readOnly: true` (or belongs to a read-only resource), the dialog opens in view-only mode — the form fields are replaced by a read-only summary.
:::

## Read-only

Use the `readOnly` prop to disable all editing interactions (event creation, drag and drop, resizing, and popover editing):

```tsx
<EventCalendar readOnly />
```

{{"demo": "ReadOnly.js", "bg": "inline", "defaultCodeOpen": false}}

### Only set on some events

#### Per event

Use the `readOnly` property on the event model to mark an event as read-only:

```ts
const event = {
  // ...other properties
  readOnly: true,
};
```

#### Per resource

Use the `areEventsReadOnly` property on the resource model to mark all events of a resource as read-only:

```ts
const resource = {
  // ...other properties
  areEventsReadOnly: true,
};
```

#### Priority order

The priority order for determining if an event is read-only is:

1. The `readOnly` property assigned to the event

```tsx
<EventCalendar events={[{ id: '1', title: 'Event 1', readOnly: true }]} />
```

2. The `areEventsReadOnly` property assigned to the event's resource

```tsx
<EventCalendar
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

3. The `readOnly` prop assigned to the Event Calendar

```tsx
<EventCalendar readOnly />
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

  return <EventCalendar resources={resources} events={events} />;
}
```
