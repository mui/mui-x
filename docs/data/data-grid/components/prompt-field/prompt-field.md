---
title: React Data Grid - Prompt Field component
productId: x-data-grid
components: PromptField, PromptFieldRecord, PromptFieldControl, PromptFieldSend
packageName: '@mui/x-data-grid-premium'
githubLabel: 'component: data grid'
---

# Data Grid - Prompt Field [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

<p class="description">Provide users with a prompt field to interact with the AI assistant.</p>

## Basic usage

The demo below shows how to add a prompt field to a custom toolbar.

{{"demo": "GridPromptField.js", "bg": "inline", "defaultCodeOpen": false}}

## Anatomy

```tsx
import {
  PromptField,
  PromptFieldRecord,
  PromptFieldControl,
  PromptFieldSend,
} from '@mui/x-data-grid-premium';

<PromptField>
  <PromptFieldRecord />
  <PromptFieldControl />
  <PromptFieldSend />
</PromptField>;
```

### Prompt Field

`<PromptField />` is the top level component that provides context to child components.
It renders a `<div />` element.

### Prompt Field Record

`<PromptFieldRecord />` is a button that records the user's voice when clicked.
It renders the `baseIconButton` slot.

### Prompt Field Control

`<PromptFieldControl />` is a component that takes user input.
It renders the `baseTextField` slot.

### Prompt Field Send

`<PromptFieldSend />` is a button that processes the prompt when clicked.
It renders the `baseIconButton` slot.

## Custom elements

Use the `render` prop to replace default elements.
See [Components usage—Customization](/x/react-data-grid/components/usage/#customization) for more details.

## Accessibility

### ARIA

- You must render a `<label />` with a `for` attribute set to the `id` of `<PromptFieldControl />`, or apply an `aria-label` attribute to the `<PromptFieldControl />`.
- You must apply a text label or an `aria-label` attribute to the `<PromptFieldRecord />` and `<PromptFieldSend />`.

### Keyboard

|                         Keys | Description                                  |
| ---------------------------: | :------------------------------------------- |
| <kbd class="key">Enter</kbd> | Sends the prompt when the control has focus. |
