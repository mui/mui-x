---
productId: x-scheduler
title: React Scheduler component
packageName: '@mui/x-scheduler-premium'
githubLabel: 'scope: scheduler'
components: EventTimelinePremium
---

# Event Timeline - Editing

<p class="description">Configure event creation, editing interactions, and read-only behavior.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader", "design": false}}

## Event creation

Use the `eventCreation` prop to customize event creation behavior:

### Disable event creation

Pass `eventCreation={false}` to disable event creation:

```tsx
<EventTimelinePremium eventCreation={false} />
```

### Custom default duration

Pass a custom value to `eventCreation.duration` to change the default duration of newly created events:

```tsx
<EventTimelinePremium eventCreation={{ duration: 60 }} />
```

{{"demo": "EventCreationDuration.js", "bg": "inline", "defaultCodeOpen": false}}

### Create event on double-click

Set `eventCreation.interaction` to `"double-click"` to open the creation form when double-clicking a cell instead of clicking:

```tsx
<EventTimelinePremium eventCreation={{ interaction: 'double-click' }} />
```

{{"demo": "EventCreationInteraction.js", "bg": "inline", "defaultCodeOpen": false}}

## Event dialog

Clicking an event or creating a new one opens the event dialog.

The dialog has two tabs:

- **General**: title, start/end date and time, all-day toggle, resource and color selectors, and description.
- **Recurrence**: frequency, interval, days of the week, and end condition.

Click any event in the demo below to open the dialog.
From there you can edit the event details or delete it.

The General tab can be recomposed with built-in and custom sections through the `eventDialogGeneralTab` slot — see the [Event dialog component page](/x/react-scheduler/components/event-dialog/).

{{"demo": "EventDialog.js", "bg": "inline", "defaultCodeOpen": false}}

:::info
Events with `readOnly: true` (or belonging to a read-only resource) open the dialog in view-only mode.
:::

### Replace the dialog with your own UI

Use the `onEventEditingStart` callback to intercept editing right before the built-in dialog opens.
It fires for every entry point (pointer, keyboard, touch, and event creation).
`eventDetails.reason` is `"creation"` when the user is creating a new event, `"view"` when the occurrence is read-only (through the event, its resource, or the `readOnly` prop) and the dialog opens in view-only mode, and `"edit"` otherwise.
`eventDetails.occurrence` is typed by that reason, so narrowing on it gives you the persisted occurrence fields on `"edit"` and `"view"` and the draft on `"creation"`.
`eventDetails.anchor` is an element that stays in the DOM after a cancellation, ready to anchor your own popover to; `eventDetails.trigger` identifies the exact activated element, but some flows unmount it right after a canceled activation (the armed toolbar's Edit button, a creation placeholder), so don't position against it.
Call `eventDetails.cancel()` to keep the built-in dialog closed and open your own editing UI instead:

```tsx
<EventTimelinePremium
  onEventEditingStart={(occurrence, eventDetails) => {
    if (eventDetails.reason === 'view') {
      // Read-only activation: keep the built-in view-only dialog.
      // Cancel here only if you render your own read-only UI instead.
      return;
    }
    eventDetails.cancel();
    if (eventDetails.reason === 'creation') {
      // Creation drafts have a synthetic `id` — use the proposed dates instead.
      openYourCreationUI(eventDetails.occurrence.displayTimezone);
    } else {
      openYourEditingUI(eventDetails.occurrence.id);
    }
  }}
/>
```

In the demo below, both clicking an event and clicking an empty cell open a custom dialog instead of the built-in one:

{{"demo": "CustomEditingUI.js", "bg": "inline", "defaultCodeOpen": false}}

:::warning
Canceling `onEventEditingStart` replaces the built-in dialog (and its mobile drawer variant): your UI owns the editing form, the recurring event scope selection ("this event", "this and following events", "all events"), and persisting the changes (for example by updating your controlled `events` state).

Everything else keeps the built-in behavior: drag and drop, resizing, the recurring scope dialog they trigger, and on touch devices the event toolbar with its edit, delete and resize affordances — there, the callback fires when the user taps the toolbar's Edit action, right before the dialog opens.
:::

## Read-only

Use the `readOnly` prop to disable all editing interactions (event creation, drag-and-drop, resizing, and popover editing):

```tsx
<EventTimelinePremium readOnly />
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

The priority order for read-only behavior is:

1. The `readOnly` property assigned to the event

```tsx
<EventTimelinePremium events={[{ id: '1', title: 'Event 1', readOnly: true }]} />
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
If a property isn't defined on the resource, the closest ancestor resource with that property defined takes precedence.
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

## Copy and paste events 🚧

:::warning
This feature isn't available yet, but it is planned—you can 👍 upvote [this GitHub issue](https://github.com/mui/mui-x/issues/19986) to help us prioritize it.
Please don't hesitate to leave a comment there to describe your needs, especially if you have a use case we should address or you're facing specific pain points with your current solution.
:::

With this feature, users would be able to copy and paste events within the timeline.

## Undo and redo 🚧

:::warning
This feature isn't available yet, but it is planned—you can 👍 upvote [this GitHub issue](https://github.com/mui/mui-x/issues/21583) to help us prioritize it.
Please don't hesitate to leave a comment there to describe your needs, especially if you have a use case we should address or you're facing specific pain points with your current solution.
:::

With this feature, users would be able to undo and redo changes made to events.
