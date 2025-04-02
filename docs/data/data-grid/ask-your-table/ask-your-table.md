---
title: Ask Your Table - AI Assistant
---

# Ask Your Table - AI Assistant [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

<p class="description">Translate natural language into a set of grid state updates and apply them to the Data Grid component.</p>

:::warning
To use this feature, you need to have a prompt processing backend. MUI offers this [service](/x/react-data-grid/ask-your-table/#with-muis-service) as a part of a premium package add-on.
Email us at [sales@mui.com](mailto:sales@mui.com) to get more information.
:::

The AI assistant feature allows users to interact with the Data Grid component using natural language.
Type the prompt like "sort by name" or "show amounts larger than 1000" in the prompt input field, and the Data Grid will update accordingly.

To enable client-side of this feature, pass `enableAiAssistant` prop.

:::success
In supported browsers, the prompt can be entered using voice.
:::

To increase the accuracy of the language processing, provide example values for the available columns.
This can be done in the following ways.

:::info
AI assistant demos use a utility function `mockPromptResolver()` to simulate the API that resolves user's prompts.
In a real-world scenario, replace this with [MUI's](/x/react-data-grid/ask-your-table/#with-muis-service) or [your own](/x/react-data-grid/ask-your-table/#with-custom-service) processing service.

`mockPromptResolver()` can handle a predefined set of prompts:

- `sort by name`
- `sort by company name and employee name`
- `show people from the EU`
- `order companies by amount of people`

You can use suggestions to quickly enter prompts that are supported by the mock resolver.

:::

## Custom examples

You can provide custom examples as a context for the prompt processing through the `examples` prop in the `columns` array.
The `examples` prop should contain an array of possible values for that column.

{{"demo": "AssistantWithExamples.js", "bg": "inline"}}

## Use row data for examples

Pass `allowAiAssistantDataSampling` prop to allow use of the row data to generate column examples.
This is useful if you are dealing with non-sensitive data and want to skip creating custom examples for each column.

Data is collected randomly on the cell level, which means that the examples per column might not come from the same rows.

For `unstable_aiAssistant.getPromptContext()` API method, pass `allowDataSampling` flag as a parameter.

```ts
const context = React.useMemo(
  () => apiRef.current.unstable_aiAssistant.getPromptContext(allowDataSampling),
  [apiRef, allowDataSampling],
);
```

{{"demo": "AssistantWithDataSampling.js", "bg": "inline"}}

## Using Server-side data

An example of combining prompt control with the [Server-side data](/x/react-data-grid/server-side-data/)

{{"demo": "AssistantWithDataSource.js", "bg": "inline"}}

## Processing service integration

Natural language prompts must be processed by a service to understand what kind of state changes must be applied to the Data Grid to match the user's request.
You can use MUI's processing service or build it by yourself.

### With MUI's service

Data Grid provides all necessary pieces to make the service integration easy.

1. Enable the AI Assistant feature by adding `enableAiAssistant` prop.
   A new toolbar button will appear in the default [`<Toolbar />`](/x/react-data-grid/components/toolbar/).
   This button opens `<AssistantPanel />` that can take user's prompts.
2. Contact [sales@mui.com](mailto:sales@mui.com) to get an API key for our processing service.

   :::error
   Avoid exposing the API key to the client by using a proxy server that receives prompt processing requests, adds the `x-api-key` header, and passes the request further to the MUI's service.

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

3. Provide `onPrompt()` callback to pass the user's prompts to the service.
   Service's response will be used internally to make the necessary state updates.

   :::success
   You can implement `onPrompt()` with `unstable_gridDefaultPromptResolver()`.
   It will add necessary headers and stringify the body in the right format for you.

   In addition to this, it allows you to add an additional prompt context to achieve better processing results.

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

### With custom service

Use pieces of the AI Assistant feature to build your own prompt processing service.

- `<GridAiAssistantPanel />` and `<GridPromptField />` components can be used to build custom UI.
- [`unstable_aiAssistant`](/x/api/data-grid/grid-api/#grid-api-prop-unstable_aiAssistant) API can be used to build the context using `getPromptContext()` and to apply the processing with `applyPromptResult(response: PromptResponse)` methods.
- `unstable_gridDefaultPromptResolver()` can be used to pass the prompt and the context(s) with the necessary headers to the processing service.

Mix and match these with your custom components/methods to implement the processing the way you need it in your project.

You can use completely custom solution and apply the processing result using other Grid's APIs like [`setFilterModel()`](/x/api/data-grid/grid-api/#grid-api-prop-setFilterModel) or [`setSortModel()`](/x/api/data-grid/grid-api/#grid-api-prop-setSortModel) without a need to structure it as `PromptResponse`.

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
