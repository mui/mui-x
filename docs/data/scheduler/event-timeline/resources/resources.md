---
productId: x-scheduler
title: React Scheduler component
packageName: '@mui/x-scheduler-premium'
githubLabel: 'scope: scheduler'
---

# Event Timeline - Resources

<p class="description">Define the properties of your events.</p>

{{"component": "@mui/docs/ComponentLinkHeader", "design": false}}

:::warning
This package is not published yet.
:::

## Define resources

Use the `resources` prop to define the list of resources the events can be associated to and the `resource` property on the event model to link an event to its resource:

```tsx
const event = [
  { resource: 'work' /** other properties */ },
  { resource: 'holidays' /** other properties */ },
];

const resources = [
  { name: 'Work', id: 'work' },
  { name: 'Holidays', id: 'holidays' },
];

<EventTimelinePremium events={events} resources={resources} />;
```

:::success
On the Event Timeline, events without resource are not rendered at all.
:::

## Visible resources

Use the `defaultVisibleResources` prop to initialize the visible resources.
A resource is visible if not in the object or if set to `true`.

{{"demo": "DefaultVisibleResources.js", "bg": "inline", "defaultCodeOpen": false}}

:::success
You can also control the visible resources using `visibleResources` and `onVisibleResourcesChange` props:

```tsx
const [visibleResources, setVisibleResources] = React.useState<
  Record<string, boolean>
>({});

return (
  <EventTimelinePremium
    visibleResources={visibleResources}
    onVisibleResourcesChange={setVisibleResources}
  />
);
```

:::

## Resource properties

### Color

Use the `eventColor` property to define a resource's color.
Here is the list of all the available color palettes:

{{"demo": "ColorPalettes.js", "bg": "inline", "defaultCodeOpen": false}}

:::success
Event colors can also be defined on the event or at the component levels.
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

### Drag interactions

Use the `areEventsDraggable` property to allow dragging a resource's events to another point in time:

```ts
const resource = {
  // ...other properties
  areEventsDraggable: true,
};
```

Use the `areEventsResizable` property to allow resizing a resource's events by dragging their start or end edge:

```ts
const resource = {
  // ...other properties
  areEventsResizable: true,
  areEventsResizable: "start" // only the start edge is draggable.
  areEventsResizable: "end" // only the end edge is draggable.
};
```

:::success
Learn more about _drag interactions_ in the [dedicated doc page](/x/react-scheduler/event-timeline/drag-interactions/).
:::

### Read-only

Use the `areEventsReadOnly` property to mark all events of a resource as read-only:

```ts
const resource = {
  // ...other properties
  areEventsReadOnly: true,
};
```

:::success
Learn more about _editing_ in the [dedicated doc page](/x/react-scheduler/event-timeline/editing/).
:::

## Store data in custom properties

Use the `resourceModelStructure` prop to define how to read properties of the resource model when they don't match the model expected by the components:

```tsx
const resourceModelStructure = {
  title: {
    getter: (resource) => resource.name,
  },
};

function Timeline() {
  return (
    <EventTimelinePremium
      resources={[{ name: 'Resource 1' /** ... */ }]}
      resourceModelStructure={resourceModelStructure}
    />
  );
}
```

{{"demo": "TitleProperty.js", "bg": "inline", "defaultCodeOpen": false}}
