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
