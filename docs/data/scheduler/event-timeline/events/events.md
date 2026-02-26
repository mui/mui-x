---
productId: x-scheduler
title: React Scheduler component
packageName: '@mui/x-scheduler-premium'
githubLabel: 'scope: scheduler'
---

# Event Timeline - Events

<p class="description">Define events for your Event Timeline.</p>

{{"component": "@mui/docs/ComponentLinkHeader", "design": false}}

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

:::success
Learn more about _timeone support_ in the [dedicated doc page](/x/react-scheduler/timezone/).
:::

### Color

Use the `color` property to define an event's color:

```ts
const event = {
  // ...other properties
  color: 'lime',
};
```

Here is the list of all the available color palettes:

{{"demo": "ColorPalettes.js", "bg": "inline", "defaultCodeOpen": false}}

:::success
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

:::success
When defined, the class is applied to the event root DOM element in all views (Week, Month, Day, and Agenda views).
:::

### Drag interactions

Use the `draggable` property to mark an event as draggable to another point in time:

```ts
const event = {
  // ...other properties
  draggable: true,
};
```

Use the `resizable` property to mark an event as resizable by dragging it's start or end edge:

```ts
const event = {
  // ...other properties
  resizable: true,
  resizable: "start" // only the start edge is draggable.
  resizable: "end" // only the end edge is draggable.
};
```

:::success
Learn more about _drag interactions_ in the [dedicated doc page](/x/react-scheduler/event-timeline/drag-interactions/).
:::

### Read-only

Use the `readOnly` property to prevent an event from being modified:

```ts
const event = {
  // ...other properties
  readOnly: true,
};
```

:::success
Learn more about _editing_ in the [dedicated doc page](/x/react-scheduler/event-timeline/editing/#read-only).
:::

### Recurring events

Use the `rrule` property to define an events recurring rule:

```ts
const event = {
  // ...other properties
  rrule: { freq: 'WEEKLY', interval: 2, byDay: ['TH'] },
};
```

:::success
Learn more about _recurring events_ in the [dedicated doc page](/x/react-scheduler/recurring-events/).
:::

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
