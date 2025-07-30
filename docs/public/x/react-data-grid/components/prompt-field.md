---
title: Data Grid - Prompt Field component
productId: x-data-grid
components: PromptField, PromptFieldRecord, PromptFieldControl, PromptFieldSend
packageName: '@mui/x-data-grid-premium'
githubLabel: 'scope: data grid'
---

# Data Grid - Prompt Field component [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

Provide users with a prompt field to interact with the AI assistant.

The prompt field is part of the [AI Assistant feature](/x/react-data-grid/ai-assistant/).

You can use the Prompt Field component directly if you want to build your own UI for the AI Assistant.

## Basic usage

The demo below shows how to add a prompt field to a custom toolbar.

```tsx
import * as React from 'react';
import {
  DataGridPremium,
  Toolbar,
  PromptField,
  PromptFieldRecord,
  PromptFieldControl,
  PromptFieldSend,
  IS_SPEECH_RECOGNITION_SUPPORTED,
  useGridApiContext,
} from '@mui/x-data-grid-premium';
import { styled } from '@mui/material/styles';
import { mockPromptResolver, useDemoData } from '@mui/x-data-grid-generator';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import SendIcon from '@mui/icons-material/Send';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const StyledToolbar = styled(Toolbar)({
  minHeight: 'auto',
  justifyContent: 'center',
});

const SUCCESS_STATUS_TEXT = 'Prompt applied';

function CustomToolbar() {
  const apiRef = useGridApiContext();
  const [statusText, setStatusText] = React.useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const placeholder = IS_SPEECH_RECOGNITION_SUPPORTED
    ? 'Type or record a prompt…'
    : 'Type a prompt…';

  const handlePromptSubmit = async (prompt: string) => {
    setStatusText(null);
    const response = await apiRef.current.aiAssistant.processPrompt(prompt);
    if (response instanceof Error) {
      setStatusText(response.message);
      setSnackbarOpen(true);
    } else {
      setStatusText(SUCCESS_STATUS_TEXT);
      setSnackbarOpen(true);
    }
  };

  return (
    <StyledToolbar>
      <PromptField onSubmit={handlePromptSubmit}>
        <PromptFieldControl
          render={({ ref, ...controlProps }, state) => (
            <TextField
              {...controlProps}
              inputRef={ref}
              aria-label="Prompt"
              placeholder={state.recording ? 'Listening for prompt…' : placeholder}
              size="small"
              sx={{ width: 320 }}
              slotProps={{
                input: {
                  startAdornment: IS_SPEECH_RECOGNITION_SUPPORTED ? (
                    <InputAdornment position="start">
                      <Tooltip title={state.recording ? 'Stop recording' : 'Record'}>
                        <PromptFieldRecord
                          render={
                            <IconButton
                              size="small"
                              edge="start"
                              color={state.recording ? 'primary' : 'default'}
                            />
                          }
                        >
                          <MicIcon fontSize="small" />
                        </PromptFieldRecord>
                      </Tooltip>
                    </InputAdornment>
                  ) : (
                    <Tooltip title="Speech recognition is not supported in this browser">
                      <MicOffIcon fontSize="small" />
                    </Tooltip>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Send">
                        <span>
                          <PromptFieldSend
                            render={
                              <IconButton size="small" edge="end" color="primary" />
                            }
                          >
                            <SendIcon fontSize="small" />
                          </PromptFieldSend>
                        </span>
                      </Tooltip>
                    </InputAdornment>
                  ),
                },
              }}
            />
          )}
        />
      </PromptField>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={statusText === SUCCESS_STATUS_TEXT ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {statusText}
        </Alert>
      </Snackbar>
    </StyledToolbar>
  );
}

export default function GridPromptField() {
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
        slots={{ toolbar: CustomToolbar }}
        aiAssistant
        onPrompt={mockPromptResolver}
        showToolbar
      />
    </div>
  );
}

```

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


# PromptField API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- Data Grid - Prompt Field component

## Import

```jsx
import { PromptField } from '@mui/x-data-grid-premium/components';
// or
import { PromptField } from '@mui/x-data-grid-premium';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| onSubmit | `function(prompt: string) => void` | - | Yes |  |
| className | `func \| string` | - | No |  |
| onRecordError | `function(error: string) => void` | - | No |  |
| render | `element \| func` | - | No |  |

> **Note**: The `ref` is forwarded to the root element (GridRoot).

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-data-grid-premium/src/components/promptField/PromptField.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-data-grid-premium/src/components/promptField/PromptField.tsx)

# PromptFieldControl API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- Data Grid - Prompt Field component

## Import

```jsx
import { PromptFieldControl } from '@mui/x-data-grid-premium/components';
// or
import { PromptFieldControl } from '@mui/x-data-grid-premium';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `func \| string` | - | No |  |
| render | `element \| func` | - | No |  |

> **Note**: The `ref` is forwarded to the root element (GridRoot).

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-data-grid-premium/src/components/promptField/PromptFieldControl.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-data-grid-premium/src/components/promptField/PromptFieldControl.tsx)

# PromptFieldRecord API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- Data Grid - Prompt Field component

## Import

```jsx
import { PromptFieldRecord } from '@mui/x-data-grid-premium/components';
// or
import { PromptFieldRecord } from '@mui/x-data-grid-premium';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `func \| string` | - | No |  |
| render | `element \| func` | - | No |  |

> **Note**: The `ref` is forwarded to the root element (GridRoot).

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-data-grid-premium/src/components/promptField/PromptFieldRecord.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-data-grid-premium/src/components/promptField/PromptFieldRecord.tsx)

# PromptFieldSend API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- Data Grid - Prompt Field component

## Import

```jsx
import { PromptFieldSend } from '@mui/x-data-grid-premium/components';
// or
import { PromptFieldSend } from '@mui/x-data-grid-premium';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `func \| string` | - | No |  |
| render | `element \| func` | - | No |  |

> **Note**: The `ref` is forwarded to the root element (GridRoot).

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-data-grid-premium/src/components/promptField/PromptFieldSend.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-data-grid-premium/src/components/promptField/PromptFieldSend.tsx)