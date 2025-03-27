---
title: Ask Your Table - AI Assistant
---

# Ask Your Table - AI Assistant [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')🧪

<p class="description">Translate natural language into a set of grid state updates and apply them to the Data Grid component.</p>

:::warning
To use this feature, you need to have a prompt processing backend. MUI offers this service as a part of a premium package add-on.
Email us at [sales@mui.com](mailto:sales@mui.com) to get more information.
:::

AI assistant feature allows users to interact with the Data Grid component using natural language.
Type the prompt like "sort by name" or "show amounts larger than 1000" in the prompt input field, and the Data Grid will update accordingly.

:::success
In supported browsers, the prompt can be entered using voice.
:::

To increase the accuracy of the language processing, provide example values for the available columns.
This can be done in the following ways.

:::info
AI assistant demos use an utility function `mockPromptResolver()` to simulate the API that resolves user's prompts.
In a real-world scenario, replace this with MUI's or your own API.

`mockPromptResolver()` can handle a predefined set of prompts:

- `sort by name`
- `sort by company name and employee name`
- `show people from the EU`
- `order companies by amount of people`

You can use suggestions to quickly enter prompts that are supported by the mock resolver.

:::

## Custom examples

You can provide custom examples for the prompt processing through the `unstable_examples` prop in the `columns` array.
The `unstable_examples` prop should contain an array of possible values for that column.

{{"demo": "AssistantWithExamples.js", "bg": "inline"}}

## Use row data for examples

Pass `allowDataSampling` flag to the `Unstable_GridToolbarPromptControl`, to let it use the row data to generate examples for the prompt processing.
This is useful if you are dealing with non-sensitive data and want to skip creating custom examples for each column.

If you are using

{{"demo": "AssistantWithDataSampling.js", "bg": "inline"}}

## Using Server-side data

An example of combining prompt control with the [Server-side data](/x/react-data-grid/server-side-data/)

{{"demo": "AssistantWithDataSource.js", "bg": "inline"}}

## Integration with MUI's API

To integrate with MUI's API, you need an API key.
Avoid exposing the API key to the client by using a proxy server that receives prompt processing requests, adds the `x-api-key` header, and passes the request further to the MUI's API.

This is an example of a Fastify proxy for the prompt requests

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

To make the integration easier, use the `unstable_gridDefaultPromptResolver` from `@mui/x-data-grid-premium` package.
It will add necessary headers and stringify the body in the right format for you.

The example below shows a code that adds an additional prompt context for better results and uses `unstable_gridDefaultPromptResolver` to avoid dealing with the request details.

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
