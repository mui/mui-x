---
productId: x-scheduler
title: React Scheduler component
packageName: '@mui/x-scheduler'
githubLabel: 'scope: scheduler'
---

# Event Calendar - Editing

<p class="description">Configure how events are created and edited.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader", "design": false}}

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

### Create event on double click

Set `eventCreation.interaction` to `"double-click"` to open the creation form when double-clicking a cell instead of clicking:

```tsx
<EventCalendar eventCreation={{ interaction: 'double-click' }} />
```

{{"demo": "EventCreationInteraction.js", "bg": "inline", "defaultCodeOpen": false}}

## Event dialog

Clicking an event or creating a new one opens the event dialog.

The dialog has two tabs:

- **General**: title, start/end date and time, all-day toggle, resource and color selectors, and description.
- **Recurrence**: frequency, interval, days of the week, and end condition. Only available with the Premium package (`@mui/x-scheduler-premium`).

Click on any event in the demo below to open the dialog. From there you can edit the event details or delete it.

{{"demo": "EventDialog.js", "bg": "inline", "defaultCodeOpen": false}}

:::success
This demo uses `EventCalendarPremium` to showcase the Recurrence tab. All other dialog features (editing title, dates, resources, colors, description, and deleting events) are available in the standard `EventCalendar` component.
:::

:::info
Events with `readOnly: true` (or belonging to a read-only resource) open the dialog in view-only mode.
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

## Copy & paste events 🚧

:::warning
This feature isn't available yet, but it is planned — you can 👍 upvote [this GitHub issue](https://github.com/mui/mui-x/issues/19986) to help us prioritize it.
Please don't hesitate to leave a comment there to describe your needs, especially if you have a use case we should address or you're facing specific pain points with your current solution.
:::

With this feature, users would be able to copy and paste events within the calendar.

## Undo / Redo 🚧

:::warning
This feature isn't available yet, but it is planned — you can 👍 upvote [this GitHub issue](https://github.com/mui/mui-x/issues/21583) to help us prioritize it.
Please don't hesitate to leave a comment there to describe your needs, especially if you have a use case we should address or you're facing specific pain points with your current solution.
:::

With this feature, users would be able to undo and redo changes made to events.
