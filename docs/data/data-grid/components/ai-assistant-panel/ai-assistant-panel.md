---
title: Data Grid - AI Assistant Panel component
productId: x-data-grid
components: AiAssistantPanelTrigger
packageName: '@mui/x-data-grid-premium'
githubLabel: 'scope: data grid'
---

# Data Grid - AI Assistant Panel component [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

<p class="description">Customize the Data Grid's AI assistant panel.</p>

:::info
Currently, the AI Assistant Panel Trigger is the available part of this component.
Full compositional customization of each panel part will be added in a future release.
:::

The AI assistant panel is part of the [AI Assistant feature](/x/react-data-grid/ai-assistant/).

You can use the AI Assistant Panel Trigger and [Toolbar](/x/react-data-grid/components/toolbar/) components when you need to customize the AI assistant panel trigger, or when implementing a custom toolbar.

## Basic usage

The demo below shows how to add an AI assistant panel trigger to a custom toolbar.

{{"demo": "GridAiAssistantPanelTrigger.js", "bg": "inline", "defaultCodeOpen": false}}

## Anatomy

```tsx
import { AiAssistantPanelTrigger } from '@mui/x-data-grid-premium';

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
