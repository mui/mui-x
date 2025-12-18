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

## Visible resources

### Initialize the visible resources

Use the `defaultVisibleResources` prop to set the initial visibility state of resources. A resource is visible if it is not in the object or if it has a `true` value.

{{"demo": "DefaultVisibleResources.js", "bg": "inline", "defaultCodeOpen": false}}

### Control the visible resources

Use the `visibleResources` and `onVisibleResourcesChange` props to control the visibility state of resources.

{{"demo": "VisibleResources.js", "bg": "inline", "defaultCodeOpen": false}}
