---
title: Data Grid - AI Assistant Panel component
productId: x-data-grid
components: AiAssistantPanelTrigger
packageName: '@mui/x-data-grid-premium'
githubLabel: 'scope: data grid'
---

# Data Grid - AI Assistant Panel component [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan') 🚧

Customize the Data Grid's AI assistant panel.

:::warning
This component is incomplete.

Currently, the AI Assistant Panel Trigger is the only part of the AI Assistant Panel component available.
Future versions of the AI Assistant Panel component will make it possible to compose each of its parts for full customization.

:::

The AI assistant panel is part of the [AI Assistant feature](/x/react-data-grid/ai-assistant/).

You can use the AI Assistant Panel Trigger and [Toolbar](/x/react-data-grid/components/toolbar/) components when you need to customize the AI assistant panel trigger, or when implementing a custom toolbar.

## Basic usage

The demo below shows how to add an AI assistant panel trigger to a custom toolbar.

```tsx
import * as React from 'react';
import {
  DataGridPremium,
  Toolbar,
  ToolbarButton,
  AiAssistantPanelTrigger,
  GridAiAssistantPanel,
} from '@mui/x-data-grid-premium';
import { mockPromptResolver, useDemoData } from '@mui/x-data-grid-generator';
import Tooltip from '@mui/material/Tooltip';
import AssistantIcon from '@mui/icons-material/Assistant';

function CustomToolbar() {
  return (
    <Toolbar>
      <Tooltip title="AI Assistant">
        <AiAssistantPanelTrigger render={<ToolbarButton />}>
          <AssistantIcon fontSize="small" />
        </AiAssistantPanelTrigger>
      </Tooltip>
    </Toolbar>
  );
}

export default function GridAiAssistantPanelTrigger() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    rowLength: 10,
    maxColumns: 10,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        {...data}
        loading={loading}
        aiAssistant
        slots={{ toolbar: CustomToolbar, aiAssistantPanel: GridAiAssistantPanel }}
        onPrompt={mockPromptResolver}
        showToolbar
      />
    </div>
  );
}

```

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


# AiAssistantPanelTrigger API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- Data Grid - AI Assistant Panel component 🚧

## Import

```jsx
import { AiAssistantPanelTrigger } from '@mui/x-data-grid-premium/components';
// or
import { AiAssistantPanelTrigger } from '@mui/x-data-grid-premium';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `func \| string` | - | No |  |
| render | `element \| func` | - | No |  |

> **Note**: The `ref` is forwarded to the root element (GridRoot).

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-data-grid-premium/src/components/aiAssistantPanel/AiAssistantPanelTrigger.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-data-grid-premium/src/components/aiAssistantPanel/AiAssistantPanelTrigger.tsx)