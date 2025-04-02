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

<!-- ### AI Assistant Panel Trigger

`<AiAssistantPanelTrigger />` is a button that opens and closes the AI assistant panel.
It renders the `baseButton` slot.

## Custom elements

Use the `render` prop to replace default elements.
See [Components usage—Customization](/x/react-data-grid/components/usage/#customization) for more details.

## Accessibility

### ARIA

You must apply a text label or an `aria-label` attribute to the `<AiAssistantPanelTrigger />`. -->
