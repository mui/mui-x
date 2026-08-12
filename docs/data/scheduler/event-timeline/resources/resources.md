---
productId: x-scheduler
title: React Scheduler component
packageName: '@mui/x-scheduler-premium'
githubLabel: 'scope: scheduler'
components: EventTimelinePremium
---

# Event Timeline - Resources

<p class="description">Define resources to group events, with support for nested hierarchies, custom colors, and visibility controls.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader", "design": false}}

## Define resources

Use the `resources` prop to define available resources, and the `resource` property on the event model to link an event to its resource:

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

On the Event Timeline, events without resource are not rendered at all.

## Nested resources

Use the `children` property to create hierarchical resource structures:

```tsx
const resources = [
  {
    id: 'engineering',
    title: 'Engineering',
    children: [
      {
        id: 'frontend',
        title: 'Frontend',
        children: [
          { id: 'web-app', title: 'Web App' },
          { id: 'mobile-app', title: 'Mobile App' },
        ],
      },
    ],
  },
];
```

{{"demo": "NestedResources.js", "bg": "inline", "defaultCodeOpen": false}}

### Default collapsed resources

Parent resources can be collapsed to hide their descendants.
Use the `defaultCollapsedResources` prop to initialize the collapsed resources.
A resource is expanded unless it is present in the object with a `true` value.

{{"demo": "DefaultCollapsedResources.js", "bg": "inline", "defaultCodeOpen": false}}

### Controlled collapsed resources

You can also control the collapsed resources using `collapsedResources` and `onCollapsedResourcesChange` props:

```tsx
const [collapsedResources, setCollapsedResources] = React.useState<
  Record<string, boolean>
>({});

return (
  <EventTimelinePremium
    collapsedResources={collapsedResources}
    onCollapsedResourcesChange={setCollapsedResources}
  />
);
```

## Visible resources

### Default visible resources

Use the `defaultVisibleResources` prop to initialize the visible resources.
A resource is visible if it's absent from the object or set to `true`.

{{"demo": "DefaultVisibleResources.js", "bg": "inline", "defaultCodeOpen": false}}

### Controlled visible resources

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

## Require a resource

Use the `shouldEventRequireResource` prop to control whether events must have a resource assigned.
When `true`, the form cannot be submitted with an empty selection — deselecting every entry in the resource picker no longer saves.

On the Event Timeline, `shouldEventRequireResource` defaults to `true` so that an event cannot be edited into a state where it would no longer be rendered.
Set it to `false` to allow saving with an empty selection:

```tsx
<EventTimelinePremium shouldEventRequireResource={false} />
```

## Multiple resources per event

An event can be associated with more than one resource by passing an array to `resource`:

```tsx
const event = {
  // ...
  resource: ['team-a', 'team-b'],
};
```

{{"demo": "MultipleResourcesPerEvent.js", "bg": "inline", "defaultCodeOpen": false}}

A multi-resource event renders once per row, each instance taking that row's `eventColor` unless the event has its own `color` — in the demo above, "Cross-team sync" renders blue in the Team A row and pink in the Team B row.

The resource picker in the edit dialog switches between a single-select and a multi-select depending on the event:

- An event whose `resource` is a string is edited as single-resource — the picker shows one entry at a time.
- An event whose `resource` is an array (including `[]`, meaning multi-resource with nothing selected yet) is edited as multi-resource.

Saving never changes that shape: an event that arrives as a string is always saved back as a string (or `undefined` once cleared), and an event that arrives as an array is always saved back as an array (`[]` once cleared).

A new event created by clicking inside a resource's row starts assigned to that row's resource (a string), so it's edited as single-resource until you turn it into an array yourself. For an event whose `resource` is `null` or not set otherwise (and for any other newly created event), use `canHaveMultipleResources` on `eventCreation` to choose the mode:

```tsx
<EventTimelinePremium eventCreation={{ canHaveMultipleResources: true }} />
```

When `canHaveMultipleResources` isn't set, it's inferred from the `events` prop: the first event with a `resource` value determines the mode for new events (a string means single, an array means multiple), and data with no resource at all defaults to multiple.

## Resource properties

### Color

Use the `eventColor` property to define a resource's color.
The available color palettes are shown below:

{{"demo": "ColorPalettes.js", "bg": "inline", "defaultCodeOpen": false}}

:::info
Event colors can also be defined on the event or at the component level.
The effective color resolves in the following order:

1. The `color` property assigned to the event. This always wins, in every row of a multi-resource event.

```tsx
<EventTimelinePremium events={[{ id: '1', title: 'Event 1', color: 'pink' }]} />
```

2. The `eventColor` property assigned to the resource of the row the event is rendered in. For a multi-resource event, this can differ from row to row.

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

Use the `areEventsDraggable` property to prevent dragging a resource's events to a different time slot:

```ts
const resource = {
  // ...other properties
  areEventsDraggable: false,
};
```

Use the `areEventsResizable` property to prevent resizing a resource's events by dragging their start or end edge:

```ts
const resource = {
  // ...other properties
  areEventsResizable: false,
  areEventsResizable: "start" // only the start edge is draggable.
  areEventsResizable: "end" // only the end edge is draggable.
};
```

See [Drag interactions](/x/react-scheduler/event-timeline/drag-interactions/) for details.

### Read-only

Use the `areEventsReadOnly` property to mark all events of a resource as read-only:

```ts
const resource = {
  // ...other properties
  areEventsReadOnly: true,
};
```

See [Editing—Read-only](/x/react-scheduler/event-timeline/editing/#read-only) for details.

## Resource column label

Use the `resourceColumnLabel` prop to customize the header of the resource column:

{{"demo": "ResourceColumnLabel.js", "bg": "inline", "defaultCodeOpen": false}}

When both are provided, `resourceColumnLabel` takes priority over `localeText.timelineResourceTitleHeader`.

## Store data in custom properties

Use the `resourceModelStructure` prop to define how to read resource properties when your data doesn't match the expected model:

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
