---
title: React Data Grid - AI Assistant Panel component
productId: x-data-grid
components: AiAssistantPanelTrigger
packageName: '@mui/x-data-grid-premium'
githubLabel: 'component: data grid'
---

# Data Grid - AI Assistant Panel [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan') 🚧

<p class="description">Customize the Data Grid's AI assistant panel.</p>

:::warning
This component is incomplete.

Currently, the AI Assistant Panel Trigger is the only part of the AI Assistant Panel component available.
Future versions of the AI Assistant Panel component will make it possible to compose each of its parts to create a custom AI assistant panel.

:::

## Basic usage

The demo below shows how to add an AI assistant panel trigger to a custom toolbar.

{{"demo": "GridAiAssistantPanelTrigger.js", "bg": "inline", "defaultCodeOpen": false}}

## Anatomy

```tsx
import { AiAssistantPanelTrigger } from '@mui/x-data-grid';

<AiAssistantPanelTrigger />;
```

### AI Assistant Panel Trigger

`<AiAssistantPanelTrigger />` is a button that opens and closes the AI assistant panel.
It renders the `baseButton` slot.

## Custom elements

Use the `render` prop to replace default elements.
See [Components usage—Customization](/x/react-data-grid/components/usage/#customization) for more details.

## Accessibility

### ARIA

You must apply a text label or an `aria-label` attribute to the `<AiAssistantPanelTrigger />`.
