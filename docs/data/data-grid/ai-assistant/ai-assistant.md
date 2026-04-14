---
title: Ask Your Table - AI Assistant
---

# Ask Your Table - AI Assistant [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

<p class="description">Translate natural language into Data Grid views.</p>

:::info
The AI Assistant requires a prompt processing backend to interpret natural language queries.
You can [build your own service](#with-a-custom-service) using any AI provider—no additional add-on is required beyond the Premium license.
Alternatively, MUI offers a [hosted processing service](#with-muis-service) as a paid add-on.
Contact [sales@mui.com](mailto:sales@mui.com) to learn more.
:::

The AI Assistant feature lets users interact with the Data Grid component using natural language.
Type a prompt like "sort by name", "show amounts larger than 1000", or even make more complex queries like "which customers brought the most revenue the past year" in the prompt input field and the Data Grid will update accordingly.
In [supported browsers](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition#browser_compatibility), users can also prompt the assistant using their voice.

To enable this feature on the Data Grid, pass the `aiAssistant` prop and use the `GridAiAssistantPanel` component for `aiAssistantPanel` slot:

```tsx
import { DataGridPremium, GridAiAssistantPanel } from '@mui/x-data-grid-premium';
// ...
<DataGridPremium aiAssistant slots={{ aiAssistantPanel: GridAiAssistantPanel }} />;
```

## Improving accuracy with example values

To increase the accuracy of the language processing, provide example values for the available columns via one of the methods below.

### Provide custom examples

Use the `examples` property on items of the `columns` array to provide custom examples as context for prompt processing.
The `examples` property should contain an array of possible values for each respective column.

:::info
AI Assistant demos use a limited version of [MUI's processing service](/x/react-data-grid/ai-assistant/#with-muis-service).
:::

{{"demo": "AssistantWithExamples.js", "bg": "inline"}}

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

## Processing service integration

Natural language prompts must be processed by a service to understand what kinds of state changes must be applied to the Data Grid to match the user's request.
You can use MUI's processing service or build your own.

### With MUI's service

The Data Grid provides all the necessary elements for integration with MUI's service.

1. Contact [sales@mui.com](mailto:sales@mui.com) to get an API key for our processing service.

   :::warning
   Do not expose the API key to the public.
   Instead, keep it private and use a proxy server that receives prompt processing requests, adds the `x-api-key` header, and forwards the request to MUI's service.

   This is an example of a Next.js App Router route handler (`app/api/prompt/route.ts`) for the prompt requests.

   ```ts
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

   This is an example of a [Fastify proxy](https://www.npmjs.com/package/@fastify/http-proxy) for the prompt requests.

   ```ts
   fastify.register(proxy, {
     upstream: 'https://backend.mui.com',
     prefix: '/api/my-custom-path',
     rewritePrefix: '/api/v1/datagrid/prompt',
     replyOptions: {
       rewriteRequestHeaders: (_, headers) => ({
         ...headers,
         'x-api-key': process.env.MUI_DATAGRID_API_KEY,
       }),
     },
   });
   ```

   :::

2. Enable the AI Assistant feature by adding the `aiAssistant` prop.
   This adds a new button to the Toolbar that controls the Assistant Panel's open state.
3. Provide `<GridAiAssistantPanel />` as a component for the `aiAssistantPanel` slot.
   Slot is by default `null` to prevent bundling of the panel and its child components in the projects that are not using the AI Assistant feature.
4. Provide the `onPrompt()` callback to pass the user's prompts to the service.
   The service's response is used internally by the Data Grid to make the necessary state updates.

   :::success
   You can implement `onPrompt()` with `unstable_gridDefaultPromptResolver()`.
   This adds the necessary headers and stringifies the body in the correct format for you.
   The `unstable_` prefix means this API may change in a minor release as it matures—it is suitable for production use.

   It also makes it possible to provide additional context for better processing results, as shown below:

   ```ts
   const PROMPT_RESOLVER_PROXY_BASE_URL =
     process.env.NODE_ENV === 'development'
       ? 'http://localhost:3000'
       : 'https://api.my-proxy.com';

   function processPrompt(query: string, context: string, conversationId?: string) {
     const additionalContext = `The rows represent: List of employees with their company, position and start date`;

     return unstable_gridDefaultPromptResolver(
       `${PROMPT_RESOLVER_PROXY_BASE_URL}/api/my-custom-path`,
       query,
       context,
       conversationId,
       { additionalContext },
     );
   }
   ```

   By default, MUI's prompt resolver service logs query text to analyze errors and improve the service—your grid's row data is never stored.
   Pass `privateMode: true` to limit logging to billing data only, with no query text stored.
   This is recommended for production deployments handling sensitive data:

   ```ts
   function processPrompt(query: string, context: string, conversationId?: string) {
     return unstable_gridDefaultPromptResolver(
       `${PROMPT_RESOLVER_PROXY_BASE_URL}/api/my-custom-path`,
       query,
       context,
       conversationId,
       { privateMode: true },
     );
   }
   ```

   :::

5. Provide data examples in either of the following ways:
   - Fill the `examples` prop in the `columns` array – this is recommended if you want to avoid exposing the row data to the AI Assistant.
   - Provide access to the row data with `allowAiAssistantDataSampling` prop – since this uses real data, it may lead to better processing results.

6. Optionally, provide `referenceId` in the metadata to track spending and set limits for each entity sharing your API key.
   The MUI Service supports `metadata` property through which you can send the reference that will be stored with the request.
   Later, use that reference in the request history analysis.

   ::warning
   The `metadata` object would store only `referenceId` property. If you are interested in storing more data, please [contact our support team](mailto:support@mui.com).
   ::

   ```ts
   function processPrompt(query: string, context: string, conversationId?: string) {
     return unstable_gridDefaultPromptResolver(
       `${PROMPT_RESOLVER_PROXY_BASE_URL}/api/my-custom-path`,
       query,
       context,
       conversationId,
       {
         metadata: {
           referenceId: 'example-user-reference',
         },
       },
     );
   }
   ```

### With a custom service

The Data Grid exposes elements of the AI Assistant feature so you can build your own prompt processing service:

- The [`aiAssistant` API](/x/api/data-grid/grid-api/#grid-api-prop-aiAssistant) for processing the prompt results and updating state
- The `unstable_gridDefaultPromptResolver()` method for passing the prompt and context with the necessary headers to the processing service

Integrate these elements with your custom components and methods to suit your specific use case.

You can use a fully custom solution and apply the processing result using other Grid APIs such as [`setFilterModel()`](/x/api/data-grid/grid-api/#grid-api-prop-setFilterModel) or [`setSortModel()`](/x/api/data-grid/grid-api/#grid-api-prop-setSortModel) without the need to structure it as a `PromptResponse`.

To replace `unstable_gridDefaultPromptResolver()` with your own solution, send a POST request to MUI's API.

The body of the request requires `query` and `context` parameters.
`conversationId` and `options` are optional.
To keep the previous messages in the context you should pass the `conversationId` from the previous response.

The API response type is `Result<PromptResponse>`.

```ts
type Result<T> = { ok: false; message: string } | { ok: true; data: T };
```

Your resolver should return `Promise<PromptResponse>`.

## Error handling

When `onPrompt` throws or the service returns `{ ok: false, message }`, the Data Grid surfaces an error indicator in the assistant panel.
Wrap your implementation to catch network errors and log them to your error tracking service:

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
      { privateMode: true },
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
