---
title: React Data Grid - Toolbar component
productId: x-data-grid
components: ToolbarRoot, ToolbarButton
packageName: '@mui/x-data-grid'
githubLabel: 'component: data grid'
---

# Data Grid - Toolbar

<p class="description">The Toolbar component enables adding custom actions and controls to the Data Grid.</p>

## Basic usage

The demo below shows the default toolbar configuration.

To extend the default toolbar, you can use copy the code below and customize it to your needs.

{{"demo": "GridToolbar.js", "bg": "inline", "defaultCodeOpen": false}}

## Anatomy

```tsx
import { Toolbar } from '@mui/x-data-grid';

<Toolbar.Root>
  <Toolbar.Button />
</Toolbar.Root>;
```

### Root

The top level component that provides context to child components.

Renders a styled `<div />` element.

### Button

A button that can be used to perform actions from the toolbar.

Renders the `baseIconButton` slot.

## Recipes

Below are some ways the Toolbar component can be used.

### Settings menu

Allow users to customize the data grid appearance from the toolbar.

{{"demo": "GridToolbarSettingsMenu.js", "bg": "inline", "defaultCodeOpen": false}}

### Filter bar

Show active filter chips in the toolbar.

{{"demo": "GridToolbarFilterBar.js", "bg": "inline", "defaultCodeOpen": false}}

## Custom elements

The default elements can be replaced using the `render` prop. See [Grid components—Customization](/x/react-data-grid/components/overview/#customization).

The demo below shows how to replace the default elements with custom ones, styled with Tailwind CSS.

{{"demo": "GridToolbarCustom.js", "bg": "inline", "defaultCodeOpen": false}}

## Accessibility

(WAI-ARIA: https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/)

The component follows the WAI-ARIA authoring practices.

### ARIA

- The element rendered by the `<Toolbar.Root />` component has the `toolbar` role.
- The element rendered by the `<Toolbar.Root />` component has `aria-orientation` set to `horizontal`.

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
