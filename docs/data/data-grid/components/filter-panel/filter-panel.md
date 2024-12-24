# Data Grid - Filter Panel component 🚧

<p class="description">Customize the filter panel UI.</p>

:::warning
This component is incomplete.

Currently, the only feature available for the Filter Panel component is the Trigger. In the future, this component will allow you to extend the data grid's filter panel.

In the meantime, see the following:

- [Filter customization—Custom filter panel](/x/react-data-grid/filtering/customization/#custom-filter-panel)

:::

## Basic usage

The demo below shows how to use the Filter Panel Trigger component to open the filter panel.

{{"demo": "GridFilterPanelTrigger.js", "bg": "inline", "defaultCodeOpen": false}}

## Anatomy

The Filter Panel component contains the following parts:

```tsx
<Grid.FilterPanel.Trigger />
```

### Trigger

A button that opens the filter panel.

Renders the `baseButton` slot.

## Accessibility

### ARIA

- The element rendered by the `Trigger` component should have a text label, or an `aria-label` attribute set.

## API

- [GridFilterPanelTrigger](/x/api/data-grid/grid-filter-panel-trigger/)
