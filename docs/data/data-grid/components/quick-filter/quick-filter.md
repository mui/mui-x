# Data Grid - Quick Filter component

<p class="description">A search field that enables users to filter grid data.</p>

## Basic usage

The demo below shows the default Quick Filter configuration.

{{"demo": "GridQuickFilter.js", "bg": "inline"}}

## Anatomy

The Quick Filter component contains the following parts:

```tsx
<Grid.QuickFilter.Root>
  <Grid.QuickFilter.Control />
  <Grid.QuickFilter.Clear />
</Grid.QuickFilter.Root>
```

### Root

The top level component.

Does not render any DOM elements.

### Control

A control that takes user input.

Renders the `baseTextField` slot.

### Clear

A button to reset the filter value.

Renders the `baseIconButton` slot.

## Custom elements

The default elements can be replaced using the `render` prop. See [Grid components—Customization](/x/react-data-grid/components/overview/#customization).

The demo below shows how to replace the default elements with custom ones, styled with Tailwind CSS.

{{"demo": "GridQuickFilterCustom.js", "bg": "inline"}}

## Accessibility

### ARIA

- The element rendered by the `Control` component should have a label associated to it, or an `aria-label` attribute set.

### Keyboard

|                          Keys | Description                                            |
| ----------------------------: | :----------------------------------------------------- |
| <kbd class="key">Escape</kbd> | Resets the filter value whilst focused on the control. |

## API

- [GridQuickFilterRoot](/x/api/data-grid/grid-quick-filter-root/)
- [GridQuickFilterControl](/x/api/data-grid/grid-quick-filter-control/)
- [GridQuickFilterClear](/x/api/data-grid/grid-quick-filter-clear/)
