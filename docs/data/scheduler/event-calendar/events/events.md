---
productId: x-scheduler
title: React Scheduler component
packageName: '@mui/x-scheduler'
githubLabel: 'scope: scheduler'
components: EventCalendar, EventCalendarPremium
---

# Event Calendar - Events

<p class="description">Configure event properties including color, timezone, recurrence, and custom data mapping.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader", "design": false}}

## Event properties

### Resource

Use the `resource` property to link an event to its resource:

```ts
const event = {
  // ...other properties
  resource: 'work',
};
```

#### Dynamic resource

Use the [`eventModelStructure`](#store-data-in-custom-properties) property to switch the resource between several fields:

{{"demo": "DynamicResourceProperty.js", "bg": "inline", "defaultCodeOpen": false}}

### All day

Use the `allDay` property to define an event as all-day:

```ts
const event = {
  // ...other properties
  allDay: true,
};
```

{{"demo": "AllDay.js", "bg": "inline", "defaultCodeOpen": false}}

### Timezone

Use the `timezone` property to specify the timezone for an event's dates:

```ts
const event = {
  // ...other properties
  timezone: 'America/New_York',
};
```

See [Timezone](/x/react-scheduler/timezone/) for details.

### Color

Use the `color` property to define an event's color:

```ts
const event = {
  // ...other properties
  color: 'lime',
};
```

The available color palettes are shown below:

{{"demo": "ColorPalettes.js", "bg": "inline", "defaultCodeOpen": false}}

:::info
Event colors can also be defined on the resources or at the component level.
The effective color resolves in the following order:

1. The `color` property assigned to the event

```tsx
<EventCalendar events={[{ id: '1', title: 'Event 1', color: 'pink' }]} />
```

2. The `eventColor` property assigned to the event's resource

```tsx
<EventCalendar resources={[{ id: '1', title: 'Resource 1', eventColor: 'pink' }]} />
```

3. The `eventColor` prop assigned to the Event Calendar

```tsx
<EventCalendar eventColor="pink" />
```

4. The default color palette, `"teal"`

:::

### Class name

Use the `className` property to apply custom CSS styles to an event:

```ts
const event = {
  // ...other properties
  className: 'highlighted-event',
};
```

{{"demo": "ClassNameProperty.js", "bg": "inline", "defaultCodeOpen": false}}

When defined, it applies to the event root DOM element in all views (Week, Month, Day, and Agenda views).

### Drag interactions

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
  resizable: "start" // only the start edge is draggable.
  resizable: "end" // only the end edge is draggable.
};
```

See [Drag interactions](/x/react-scheduler/event-calendar/drag-interactions/) for details.

### Read-only

Use the `readOnly` property to prevent an event from being modified:

```ts
const event = {
  // ...other properties
  readOnly: true,
};
```

See [Editing—Read-only](/x/react-scheduler/event-calendar/editing/#read-only) for details.

### Recurring events [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

Use the `rrule` property to define an event's recurring rule:

```ts
const event = {
  // ...other properties
  rrule: 'FREQ=WEEKLY;INTERVAL=2;BYDAY=TH',
};
```

See [Recurring events](/x/react-scheduler/recurring-events/) for details.

## Store data in custom properties

Use the `eventModelStructure` prop to define how to read and write event properties when your data doesn't match the expected model:

```tsx
const eventModelStructure = {
  title: {
    getter: (event) => event.name,
    setter: (event, newValue) => {
      event.name = newValue;
    },
  },
};

function Calendar() {
  return (
    <EventCalendar
      events={[{ name: 'Event 1' /** ... */ }]}
      eventModelStructure={eventModelStructure}
    />
  );
}
```

{{"demo": "TitleProperty.js", "bg": "inline", "defaultCodeOpen": false}}

A property declared with a `getter` but no `setter` is not writable: the Event Calendar can display it but never writes it back to your model. `start` and `end` are the only properties this is meaningful for — declaring any other property this way isn't supported and can corrupt your model, since the calendar still attempts to write it.

When `start` or `end` is not writable, dragging and creating events are disabled, the same way they are with `readOnly`: dragging that date is off (only the other side's resize handle stays enabled), and creating a new event — from the dialog, the keyboard shortcut, or dragging one in from the outside — is off too, since a new event has no old date to fall back to.

Saving other changes still works: for a non-recurring event, or a recurring one saved with the "All events" scope, the event dialog leaves the non-writable date unchanged. Saving with the "Only this event" or "This and following events" scope needs to write a brand-new date instead, to detach the occurrence into its own event, so — like a creation — it's refused, with an error shown after saving rather than disabled up front. A copy-paste is refused the same way, and so is a cut-paste that would move the cut event's own dates; a cut that leaves them alone (for example, changing only the resource) still goes through.

## Event constraints 🚧

:::warning
This feature isn't available yet, but it is planned—you can 👍 upvote [this GitHub issue](https://github.com/mui/mui-x/issues/21582) to help us prioritize it.
Please don't hesitate to leave a comment there to describe your needs, especially if you have a use case we should address or you're facing specific pain points with your current solution.
:::

With this feature, users would be able to define constraints on events, such as restricting them to specific time ranges or resources.
