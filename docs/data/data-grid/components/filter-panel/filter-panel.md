# Data Grid - Filter Panel component 🚧

<p class="description">Customize the filter panel UI.</p>

:::warning
This component is incomplete.

Currently, the only feature available for the Filter Panel component is the Trigger. In the future, this component will allow you to extend the data grid's filter panel.
:::

## Anatomy

The `Grid.FilterPanel` component is comprised of the following parts.

```tsx
<Grid.FilterPanel.Trigger />
```

### Trigger

A button that opens the filter panel.

Renders a [Button](/material-ui/react-button/) component or a custom button provided to `slots.baseButton`.

## Examples

Below are some ways the Filter Panel component can be used.

### Toolbar filter panel trigger

Toggle the visibility of the filter panel.

{{"demo": "GridFilterPanelTrigger.js", "bg": "inline"}}

## API

- [Grid](/x/api/data-grid/data-grid/)
- [GridFilterPanel](/x/api/data-grid/data-grid/)
- [GridFilterPanelTrigger](/x/api/data-grid/data-grid/)
