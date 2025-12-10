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

## Define the data in custom properties

You can use the `resourceModelStructure` prop to define how to read properties of the resource model when they don't match the model expected by the components:

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

## Controlling visible resources

You can control which resources are visible by using the `visibleResources`, `defaultVisibleResources`, and `onVisibleResourcesChange` props:

- `visibleResources`: A `Map<SchedulerResourceId, boolean>` that defines the visibility status of each resource. A resource is visible if it is not in the map or if it has a `true` value.
- `defaultVisibleResources`: The initial visibility state for uncontrolled components.
- `onVisibleResourcesChange`: A callback fired when the visibility of resources changes.

{{"demo": "VisibleResources.js", "bg": "inline", "defaultCodeOpen": false}}
