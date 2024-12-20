# Data Grid - Columns Panel component 🚧

<p class="description">Customize the columns panel UI.</p>

:::warning
This component is incomplete.

Currently, the only feature available for the Columns Panel component is the Trigger. In the future, this component will allow you to extend the data grid's columns panel.

In the meantime, see the following:

- [Custom subcomponents—Columns panel](/x/react-data-grid/components/#columns-panel)

:::

## Basic usage

The demo below shows how to use the Columns Panel Trigger component to open the columns panel.

{{"demo": "GridColumnsPanelTrigger.js", "bg": "inline"}}

## Anatomy

The Columns Panel component contains the following parts:

```tsx
<Grid.ColumnsPanel.Trigger />
```

### Trigger

A button that opens the columns panel.

Renders the `baseButton` slot.

## Accessibility

### ARIA

- The element rendered by the `Trigger` component should have a text label, or an `aria-label` attribute set.

## API

- [GridColumnsPanelTrigger](/x/api/data-grid/grid-columns-panel-trigger/)
