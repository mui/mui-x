---
productId: x-scheduler
title: React Scheduler component
packageName: '@mui/x-scheduler-premium'
githubLabel: 'scope: scheduler'
components: EventTimelinePremium
---

# Event Timeline - Events

<p class="description">Define events for your Event Timeline.</p>

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

Use the [eventModelStructure](#store-data-in-custom-properties) property to switch the resource between several fields:

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

Use the `timezone` property to define in which timezone an event's dates are defined:

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
Event colors can also be defined on the resources or at the component levels.
The effective color resolves in the following order:

1. The `color` property assigned to the event

```tsx
<EventTimelinePremium events={[{ id: '1', title: 'Event 1', color: 'pink' }]} />
```

2. The `eventColor` property assigned to the event's resource

```tsx
<EventTimelinePremium
  resources={[{ id: '1', title: 'Resource 1', eventColor: 'pink' }]}
/>
```

3. The `eventColor` prop assigned to the Event Timeline

```tsx
<EventTimelinePremium eventColor="pink" />
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

When defined, the class is applied to the event root DOM element across all views.

### Drag interactions

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
  resizable: "start" // only the start edge is draggable.
  resizable: "end" // only the end edge is draggable.
};
```

See [Drag interactions](/x/react-scheduler/event-timeline/drag-interactions/) for details.

### Read-only

Use the `readOnly` property to prevent an event from being modified:

```ts
const event = {
  // ...other properties
  readOnly: true,
};
```

See [Editing—Read-only](/x/react-scheduler/event-timeline/editing/#read-only) for details.

### Recurring events

Use the `rrule` property to define an event's recurring rule:

```ts
const event = {
  // ...other properties
  rrule: 'FREQ=WEEKLY;INTERVAL=2;BYDAY=TH',
};
```

See [Recurring events](/x/react-scheduler/recurring-events/) for details.

## Store data in custom properties

Use the `eventModelStructure` prop to define how to read and write properties of the event model when they don't match the model expected by the components:

```tsx
const eventModelStructure = {
  title: {
    getter: (event) => event.name,
    setter: (event, newValue) => {
      event.name = newValue;
    },
  },
};

function Timeline() {
  return (
    <EventTimelinePremium
      events={[{ name: 'Event 1' /** ... */ }]}
      eventModelStructure={eventModelStructure}
    />
  );
}
```

{{"demo": "TitleProperty.js", "bg": "inline", "defaultCodeOpen": false}}

## Event constraints 🚧

:::warning
This feature isn't available yet, but it is planned—you can 👍 upvote [this GitHub issue](https://github.com/mui/mui-x/issues/21582) to help us prioritize it.
Please don't hesitate to leave a comment there to describe your needs, especially if you have a use case we should address or you're facing specific pain points with your current solution.
:::

With this feature, users would be able to define constraints on events, such as restricting them to specific time ranges or resources.
