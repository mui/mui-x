---
productId: x-scheduler
title: React Scheduler component
packageName: '@mui/x-scheduler'
githubLabel: 'scope: scheduler'
---

# Scheduler - Resource properties

<p class="description">Define the properties of your events.</p>

{{"component": "@mui/docs/ComponentLinkHeader", "design": false}}

:::warning
This package is not published yet.
:::

## Visible resources

### Initialize the visible resources

Use the `defaultVisibleResources` prop to set the visible resources to use when the Event Calendar mounts.
A resource is visible if not in the object or if set to `true`.

{{"demo": "DefaultVisibleResources.js", "bg": "inline", "defaultCodeOpen": false}}

:::success
You can also control the visible resources using `visibleResources` and `onVisibleResourcesChange` props:

```tsx
const [visibleResources, setVisibleResources] = React.useState<
  Record<string, boolean>
>({});

return (
  <EventCalendar
    visibleResources={visibleResources}
    onVisibleResourcesChange={setVisibleResources}
  />
);
```

:::

## Basic properties

### Color

Use the `color` property on the resource model to define its color.
Here is the list of all the available color palettes:

{{"demo": "ColorPalettes.js", "bg": "inline", "defaultCodeOpen": false}}

:::success
Event colors can also be defined on the event or at the component levels.
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

## Define the data in custom properties

Use the `resourceModelStructure` prop to define how to read properties of the resource model when they don't match the model expected by the components:

```tsx
const resourceModelStructure = {
  title: {
    getter: (resource) => resource.name,
  },
};

function Calendar() {
  return (
    <EventCalendar
      resources={[{ name: 'Resource 1' /** ... */ }]}
      resourceModelStructure={resourceModelStructure}
    />
  );
}
```

{{"demo": "TitleProperty.js", "bg": "inline", "defaultCodeOpen": false}}
