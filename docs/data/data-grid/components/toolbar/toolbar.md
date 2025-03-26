---
title: React Data Grid - Toolbar component
productId: x-data-grid
components: Toolbar, ToolbarButton, ToolbarLabel
packageName: '@mui/x-data-grid'
githubLabel: 'component: data grid'
---

# Data Grid - Toolbar

<p class="description">Add custom actions and controls to the Data Grid.</p>

## Basic usage

The demo below shows the default toolbar configuration.

To extend the default toolbar, the code in the demo below can be copied and customized to your needs.

{{"demo": "GridToolbar.js", "bg": "inline", "defaultCodeOpen": false}}

## Anatomy

```tsx
import { Toolbar, ToolbarButton, ToolbarLabel } from '@mui/x-data-grid';

<Toolbar>
  <ToolbarLabel />
  <ToolbarButton />
</Toolbar>;
```

### Toolbar

The Toolbar is the top level component that provides context to child components.
It renders a styled `<div />` element.

### Toolbar Button

`<ToolbarButton />` is a button for performing actions from the toolbar.
It renders the `baseIconButton` slot.

### Toolbar Label

`<ToolbarLabel />` is a label component that displays text in the toolbar.
It renders a styled `<span />` element.
By default, it displays the text from the DataGrid's `label` prop, but you can override this by providing your own content as `children` to the component.

## Recipes

Below are some ways the Toolbar component can be used.

### Settings menu

The demo below shows how to display an appearance settings menu on the toolbar. It uses local storage to persist the user's selections.

{{"demo": "GridToolbarSettingsMenu.js", "bg": "inline", "defaultCodeOpen": false}}

### Filter bar

The demo below shows how to display active filter chips on the toolbar.

{{"demo": "GridToolbarFilterBar.js", "bg": "inline", "defaultCodeOpen": false}}

## Custom elements

Use the `render` prop to replace default elements. See [Components usage—Customization](/x/react-data-grid/components/usage/#customization) for more details.

The demo below shows how to replace the default elements with custom ones, styled with Tailwind CSS.

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

|                                                    Keys | Description                              |
| ------------------------------------------------------: | :--------------------------------------- |
|                              <kbd class="key">Tab</kbd> | Moves focus into and out of the toolbar. |
| <kbd class="key">Shift</kbd>+<kbd class="key">Tab</kbd> | Moves focus into and out of the toolbar. |
|                             <kbd class="key">Left</kbd> | Moves focus to the previous button.      |
|                            <kbd class="key">Right</kbd> | Moves focus to the next button.          |
|                             <kbd class="key">Home</kbd> | Moves focus to the first button.         |
|                              <kbd class="key">End</kbd> | Moves focus to the last button.          |
