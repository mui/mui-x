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

You can use the `eventModelStructure` prop to define how to read and write properties of the event model when they are not the one expected by the components:

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

### Dynamic resource field

This can be useful to switch the resource between several fields:

{{"demo": "ResourceProperty.js", "bg": "inline", "defaultCodeOpen": false}}
