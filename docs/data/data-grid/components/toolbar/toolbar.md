---
productId: x-data-grid
components: Toolbar, ToolbarButton
packageName: '@mui/x-data-grid'
githubLabel: 'scope: data grid'
---

# Data Grid - Toolbar component

<p class="description">Add custom actions and controls to the Data Grid.</p>

The default toolbar can be enabled by passing the `showToolbar` prop to the `<DataGrid />` component.

You can use the Toolbar and various other [Data Grid components](/x/react-data-grid/components/usage/) when you need to customize the toolbar.

## Basic usage

The demo below shows how to compose the Toolbar and various other components to look and behave like the built-in toolbar.

{{"demo": "GridToolbar.js", "bg": "inline", "defaultCodeOpen": false}}

## Anatomy

```tsx
import { Toolbar, ToolbarButton } from '@mui/x-data-grid';

<Toolbar>
  <ToolbarButton />
</Toolbar>;
```

### Toolbar

The Toolbar is the top level component that provides context to child components.
It renders a styled `<div />` element.

### Toolbar Button

`<ToolbarButton />` is a button for performing actions from the toolbar.
It renders the `baseIconButton` slot.

## Recipes

Below are some ways the Toolbar component can be used.

### Settings menu

The demo below shows how to display an appearance settings menu on the toolbar. It uses local storage to persist the user's selections.

{{"demo": "GridToolbarSettingsMenu.js", "bg": "inline", "defaultCodeOpen": false}}

### Filter bar

The demo below shows how to display active filter chips on the toolbar.

{{"demo": "GridToolbarFilterBar.js", "bg": "inline", "defaultCodeOpen": false}}

### Row grouping toolbar

The demo below shows how to add a custom toolbar that enables creating and reordering groups with drag and drop.

Users can create groups by dragging column headers into the toolbar, reorder them by dragging the chips within the toolbar, and remove them by clicking the delete button.

{{"demo": "GridToolbarRowGrouping.js", "bg": "inline", "defaultCodeOpen": false}}

## Custom elements

Use the `render` prop to replace default elements. See [Components usage—Customization](/x/react-data-grid/components/usage/#customization) for more details.

The demo below shows how to replace the default elements with custom ones, styled with Tailwind CSS.

{{"demo": "GridToolbarCustom.js", "bg": "inline", "defaultCodeOpen": false, "iframe": true}}

## Accessibility

(WAI-ARIA: https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/)

The component follows the WAI-ARIA authoring practices.

### ARIA

- The element rendered by the `<Toolbar />` component has the `toolbar` role.
- The element rendered by the `<Toolbar />` component has `aria-orientation` set to `horizontal`.
- You must apply a text label or an `aria-label` attribute to the `<ToolbarButton />`.

### Keyboard

The Toolbar component supports keyboard navigation.
It implements the roving tabindex pattern.

|                                                               Keys | Description                              |
| -----------------------------------------------------------------: | :--------------------------------------- |
|                                         <kbd class="key">Tab</kbd> | Moves focus into and out of the toolbar. |
| <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Tab</kbd></kbd> | Moves focus into and out of the toolbar. |
|                                        <kbd class="key">Left</kbd> | Moves focus to the previous button.      |
|                                       <kbd class="key">Right</kbd> | Moves focus to the next button.          |
|                                        <kbd class="key">Home</kbd> | Moves focus to the first button.         |
|                                         <kbd class="key">End</kbd> | Moves focus to the last button.          |

## Legacy toolbar

:::warning
Deprecated API.
:::

The components above replaced the [legacy toolbar](/x/react-data-grid/components/#legacy-toolbar), for example`<GridToolbarContainer>`.
