---
title: Ask Your Table - AI Assistant
---

# Ask Your Table - AI Assistant [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

<p class="description">Translate natural language into Data Grid views.</p>

:::warning
To use this feature you must have a prompt processing backend.
MUI [offers this service](/x/react-data-grid/ai-assistant/#with-muis-service) as a part of a premium package add-on.
Email us at [sales@mui.com](mailto:sales@mui.com) for more information.
:::

The AI assistant feature lets users interact with the Data Grid component using natural language.
Type a prompt like "sort by name", "show amounts larger than 1000", or even make more complex queries like "which customers brought the most revenue the past year" in the prompt input field and the Data Grid will update accordingly.
In [supported browsers](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition#browser_compatibility), users can also prompt the assistant using their voice.

To enable client-side of this feature, pass `aiAssistant` prop.

## Improving accuracy with example values

To increase the accuracy of the language processing, provide example values for the available columns via one of the methods below.

:::info
AI assistant demos use a utility function `mockPromptResolver()` to simulate the API that resolves user's prompts.
In a real-world scenario, you'd need to replace this with [MUI's processing service](/x/react-data-grid/ai-assistant/#with-muis-service) or [your own custom service](/x/react-data-grid/ai-assistant/#with-a-custom-service).

`mockPromptResolver()` can handle a predefined set of prompts:

- `sort by name`
- `sort by company name and employee name`
- `show people from the EU`
- `order companies by amount of people`

You can use suggestions to quickly enter prompts that are supported by the mock resolver.

:::

### Provide custom examples

Use the `examples` prop in the `columns` array to provide custom examples as context for prompt processing.
The `examples` prop should contain an array of possible values for its respective column.

{{"demo": "AssistantWithExamples.js", "bg": "inline"}}

### Use row data for examples

Pass the `allowAiAssistantDataSampling` prop to use row data to generate examples.
This is useful if you're dealing with non-sensitive data and want to skip creating custom examples for each column.

Data is collected randomly at the cell level, which means that the examples for a given column might not come from the same rows.

{{"demo": "AssistantWithDataSampling.js", "bg": "inline"}}

### Using server-side data

The example below shows how to combine AI assistant with [server-side data](/x/react-data-grid/server-side-data/).

{{"demo": "AssistantWithDataSource.js", "bg": "inline"}}

## Processing service integration

Natural language prompts must be processed by a service to understand what kinds of state changes must be applied to the Data Grid to match the user's request.
You can use MUI's processing service or build your own.

### With MUI's service

The Data Grid provides all the necessary elements for integration with MUI's service.

1. Contact [sales@mui.com](mailto:sales@mui.com) to get an API key for our processing service.

   :::warning
   Avoid exposing the API key to the client by using a proxy server that receives prompt processing requests, adds the `x-api-key` header, and passes the request on to MUI's service.

   This is an example of a [Fastify proxy](https://www.npmjs.com/package/@fastify/http-proxy) for the prompt requests.

   ```ts
   fastify.register(proxy, {
     upstream: 'https://api.mui.com',
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
   This adds a new button to the Toolbar that opens the Assistant Panel to receive the user's prompts.
3. Provide the `onPrompt()` callback to pass the user's prompts to the service.
   The service's response is used internally by the Data Grid to make the necessary state updates.

   :::success
   You can implement `onPrompt()` with `unstable_gridDefaultPromptResolver()`.
   This adds the necessary headers and stringifies the body in the correct format for you.

   It also makes it possible to provide additional context for better processing results, as shown below:

   ```ts
   const PROMPT_RESOLVER_PROXY_BASE_URL =
     process.env.NODE_ENV === 'development'
       ? 'http://localhost:3000'
       : 'https://api.my-proxy.com';

   function processPrompt(query: string, context: string) {
     const additionalContext = `The rows represent: List of employees with their company, position and start date`;

     return unstable_gridDefaultPromptResolver(
       `${PROMPT_RESOLVER_PROXY_BASE_URL}/api/my-custom-path`,
       query,
       context,
       additionalContext,
     );
   }
   ```

   :::

4. Provide data examples by either allowing data sampling with `allowAiAssistantDataSampling` prop or by filling the `examples` prop in the `columns` array.

### With a custom service

The Data Grid exposes several key elements of the AI Assistant feature so you can build your own prompt processing service:

- The [AI Assistant Panel](/x/react-data-grid/components/ai-assistant-panel/) and [Prompt Field](/x/react-data-grid/components/prompt-field/) components can be used to build custom UI.
- The [`aiAssistant` API](/x/api/data-grid/grid-api/#grid-api-prop-aiAssistant) for processing the prompt results and updating state
- The `unstable_gridDefaultPromptResolver()` method for passing the prompt and context with the necessary headers to the processing service

Integrate these elements with your custom components and methods to suit your specific use case.

You can use a fully custom solution and apply the processing result using other Grid APIs such as [`setFilterModel()`](/x/api/data-grid/grid-api/#grid-api-prop-setFilterModel) or [`setSortModel()`](/x/api/data-grid/grid-api/#grid-api-prop-setSortModel) without the need to structure it as a `PromptResponse`.

To replace `unstable_gridDefaultPromptResolver()` with your own solution, send a POST request to MUI's API.
The body of the request requires `query` and `context` parameters.
`additionalContext` is optional.
The API response type is `Result<PromptResponse>`.

```ts
type Result<T> = { ok: false; message: string } | { ok: true; data: T };
```

Your resolver should return `Promise<PromptResponse>`.

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
