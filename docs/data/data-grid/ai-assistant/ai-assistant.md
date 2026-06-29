---
title: Ask Your Table - AI Assistant
---

# Ask Your Table - AI Assistant [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

<p class="description">Translate natural language into Data Grid views.</p>

The AI Assistant feature lets users interact with the Data Grid component using natural language.
Type a prompt like "sort by name", "show amounts larger than 1000", or even make more complex queries like "which customers brought the most revenue the past year" in the prompt input field and the Data Grid will update accordingly.
In [supported browsers](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition#browser_compatibility), users can also prompt the assistant using their voice.

:::info
AI Assistant demos on this page use a limited version of MUI's hosted processing service.
:::

{{"demo": "AssistantWithExamples.js", "bg": "inline", "defaultCodeOpen": false}}

## Get started

The AI Assistant requires a prompt processing backend to interpret natural language queries.
The fastest way to start is with MUI's hosted processing service.
Premium license holders get starter credits to try the AI Assistant at no additional cost beyond their license.
Usage beyond the included credits may require a paid plan, managed from the Console.

[Get a free API key in MUI Console](https://console.mui.com/lp/ai-datagrid?utm_source=docs&utm_medium=ai-assistant&utm_content=get-free-api-key)

A small server-side proxy is required to keep your API key private.
The browser sends prompts to your endpoint, and your endpoint forwards them to MUI's service with the API key.

To get started:

1. Store the API key in a server-side environment variable, for example `MUI_DATAGRID_API_KEY`.
2. Create a proxy endpoint in your app.
3. Pass the proxy endpoint to `unstable_gridDefaultPromptResolver()` from `onPrompt()`.

### Minimal setup

Create a server route that forwards prompts to MUI's service with your API key:

```ts
// app/api/prompt/route.ts
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const response = await fetch('https://backend.mui.com/api/v1/datagrid/prompt', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': process.env.MUI_DATAGRID_API_KEY!,
    },
    body,
  });
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
```

To enable this feature on the Data Grid, pass the `aiAssistant` prop, use the `GridAiAssistantPanel` component for the `aiAssistantPanel` slot, and call your proxy from `onPrompt()`.
The `/api/prompt` path below should point to your proxy endpoint:

```tsx
import {
  DataGridPremium,
  GridAiAssistantPanel,
  unstable_gridDefaultPromptResolver as promptResolver,
} from '@mui/x-data-grid-premium';

function processPrompt(prompt: string, context: string, conversationId?: string) {
  return promptResolver('/api/prompt', prompt, context, conversationId);
}

// ...
<DataGridPremium
  aiAssistant
  onPrompt={processPrompt}
  slots={{ aiAssistantPanel: GridAiAssistantPanel }}
/>;
```

## Improving accuracy with example values

To increase the accuracy of the language processing, provide example values for the available columns via one of the methods below.

### Provide custom examples

Use the `examples` property on items of the `columns` array to provide custom examples as context for prompt processing.
The `examples` property should contain an array of possible values for each respective column.
The demo at the top of the page uses this approach.

:::success
Provide examples for the [derived columns](/x/react-data-grid/pivoting/#derived-columns-in-pivot-mode) using the `getPivotDerivedColumns` prop.
:::

### Use row data for examples

Pass the `allowAiAssistantDataSampling` prop to use row data to generate examples.
This is useful if you're dealing with non-sensitive data and want to skip creating custom examples for each column.

Data is collected randomly at the cell level, which means that the examples for a given column might not come from the same rows.

{{"demo": "AssistantWithDataSampling.js", "bg": "inline"}}

### Using server-side data

The example below shows how to combine the AI Assistant with [server-side data](/x/react-data-grid/server-side-data/).

{{"demo": "AssistantWithDataSource.js", "bg": "inline"}}

### Data visualization

AI Assistant analyzes the query to determine if it is helpful to visualize the results.

[Integrate](/x/react-data-grid/charts-integration/) the Data Grid with [MUI X Charts](/x/react-charts/) to enable the Data Grid to apply the visualization instructions.

{{"demo": "AssistantWithCharts.js", "bg": "inline"}}

## Build your own service

You can replace MUI's hosted processing service with your own prompt processing service.
This gives you full control over the AI provider, prompts, logging, routing, and data handling.

Building your own service means the prompt processing no longer depends on MUI's hosted service or a MUI Console API key.
You still need Data Grid Premium to use the AI Assistant UI and APIs in the grid.

The Data Grid exposes elements of the AI Assistant feature to integrate with your service:

- The [`aiAssistant` API](/x/api/data-grid/grid-api/#grid-api-prop-aiAssistant) for processing the prompt results and updating state
- The `unstable_gridDefaultPromptResolver()` function for passing the prompt and context to the processing service

Integrate these elements with your custom components and methods to suit your specific use case.

You can use a fully custom solution and apply the processing result using other Grid APIs such as [`setFilterModel()`](/x/api/data-grid/grid-api/#grid-api-prop-setFilterModel) or [`setSortModel()`](/x/api/data-grid/grid-api/#grid-api-prop-setSortModel) without the need to structure it as a `PromptResponse`.

To use `unstable_gridDefaultPromptResolver()` with your own service, expose an endpoint that accepts the same request body and returns the response shape expected by the resolver.
The request body includes `query` and `context` parameters.
`conversationId` and `options` are optional.
To keep the previous messages in the context you should pass the `conversationId` from the previous response.

The response type should be `Result<PromptResponse>`.

```ts
type Result<T> = { ok: false; message: string } | { ok: true; data: T };
```

If you do not want to use `unstable_gridDefaultPromptResolver()`, implement `onPrompt()` directly.
Your resolver should return `Promise<PromptResponse>`.

## Error handling

When `onPrompt` rejects, the Data Grid automatically displays the error message in the assistant panel.
`unstable_gridDefaultPromptResolver()` converts `{ ok: false, message }` service responses into a rejected promise, so this happens without any extra handling in your code.

If you want to log errors to an external service before the Data Grid handles them, wrap your implementation in a try/catch and re-throw:

```ts
async function processPrompt(
  query: string,
  context: string,
  conversationId?: string,
) {
  try {
    return await unstable_gridDefaultPromptResolver(
      `${PROMPT_RESOLVER_PROXY_BASE_URL}/api/my-custom-path`,
      query,
      context,
      conversationId,
    );
  } catch (error) {
    // Report to your error tracking service (Sentry, Datadog, etc.)
    console.error('[AI Assistant] Prompt processing failed:', error);
    throw error;
  }
}
```

If users receive unexpected or incorrect grid updates, provide more specific column `examples` or add an `additionalContext` string describing what the rows represent.
This gives the model enough context to interpret ambiguous queries correctly.

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
