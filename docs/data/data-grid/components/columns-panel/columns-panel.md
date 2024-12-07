# Data Grid - Columns Panel component 🚧

<p class="description">Customize the columns panel UI.</p>

:::warning
This component is incomplete.

Currently, the only feature available for the Columns Panel component is the Trigger. In the future, this component will allow you to extend the data grid's columns panel.
:::

## Anatomy

The Columns Panel component is comprised of the following parts:

```tsx
<Grid.ColumnsPanel.Trigger />
```

### Trigger

A button that opens the columns panel.

Renders a [Button](/material-ui/react-button/) component or a custom button provided to `slots.baseButton`.

## Examples

Below are some ways the Columns Panel component can be used.

### Toolbar columns panel trigger

Toggle the visibility of the columns panel.

{{"demo": "GridColumnsPanelTrigger.js", "bg": "inline"}}

## API

- [GridColumnsPanelTrigger](/x/api/data-grid/grid-columns-panel-trigger/)
