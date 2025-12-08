---
productId: x-scheduler
title: React Scheduler component
packageName: '@mui/x-scheduler'
githubLabel: 'scope: scheduler'
---

# Scheduler - Event properties

<p class="description">Define the properties of your events.</p>

{{"component": "@mui/docs/ComponentLinkHeader", "design": false}}

:::warning
This package is not published yet.
:::

## Event creation

You can use the `eventCreation` prop to customize how newly created events are defined:

### Disable event creation

Pass `eventCreation={false}` to disable the event creation:

```tsx
<EventCreation eventCreation={false} />
```

### Custom default duration

Pass a custom value to `eventCreation.duration` to change the default duration of newly created event:

```tsx
<EventCreation eventCreation={{ duration: 60 }} />
```

{{"demo": "EventCreationDuration.js", "bg": "inline", "defaultCodeOpen": false}}

### Create event on click

Set `eventCreation.interaction` to `"click"` to open the creation form when clicking a cell instead of double-clicking:

```tsx
<EventCreation eventCreation={{ interaction: 'click' }} />
```

{{"demo": "EventCreationInteraction.js", "bg": "inline", "defaultCodeOpen": false}}

## Define the data in custom properties

You can use the `eventModelStructure` prop to define how to read and write properties of the event model when they don't match the model expected by the components:

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

### String dates

A common use case is to convert your dates from a string to a valid date object:

{{"demo": "StartEndProperties.js", "bg": "inline", "defaultCodeOpen": false}}

### Dynamic resource field

This can also be useful to switch the resource between several fields:

{{"demo": "ResourceProperty.js", "bg": "inline", "defaultCodeOpen": false}}

## Other properties

### Class name

You can use the `className` property on your events to apply custom CSS styles.
When defined, this class is applied to the event element in all views (Week, Month, Day, and Agenda views).

```tsx
const events = [
  {
    id: '1',
    title: 'Important Meeting',
    start: new Date('2025-07-01T10:00:00'),
    end: new Date('2025-07-01T11:00:00'),
    className: 'highlighted-event',
  },
];
```

{{"demo": "ClassNameProperty.js", "bg": "inline", "defaultCodeOpen": false}}
