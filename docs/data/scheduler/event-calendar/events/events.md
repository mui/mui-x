---
productId: x-scheduler
title: React Scheduler component
packageName: '@mui/x-scheduler'
githubLabel: 'scope: scheduler'
---

# Scheduler - Event Calendar

<p class="description">Define events for your Event Calendar.</p>

{{"component": "@mui/docs/ComponentLinkHeader", "design": false}}

## Basic properties

### All day

Use the `allDay` property on the event model to define it as all-day:

```ts
const event = {
  // ...other properties
  allDay: true,
};
```

{{"demo": "AllDay.js", "bg": "inline", "defaultCodeOpen": false}}

### Color

Use the `color` property on the event model to define its color:

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

1. The `color` assigned to the event

```tsx
<EventCalendar events={[{ id: '1', title: 'Event 1', color: 'pink' }]} />
```

2. The `eventColor` assigned to the event's resource

```tsx
<EventCalendar resources={[{ id: '1', title: 'Resource 1', eventColor: 'pink' }]} />
```

3. The `eventColor` assigned to the Event Calendar

```tsx
<EventCalendar eventColor="pink" />
```

4. The default color palette, `"teal"`

:::

### Class name

Use the `className` property on your events to apply custom CSS styles.

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

## Define the data in custom properties

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
