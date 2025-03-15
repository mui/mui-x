---
title: Data Grid - Prompt
---

# Data Grid - Prompt [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

<p class="description">Translate natural language into a set of grid state updates and apply them to the Data Grid component.</p>

:::warning
To use this feature, you need to have a prompt processing backend. MUI offers this service as a part of a premium package add-on. Check [licensing page](/x/introduction/licensing/) for more information.
:::

The prompt feature allows users to interact with the Data Grid component using natural language. The user can type commands like "sort by name" or "show amounts larger than 1000" in the prompt input field, and the Data Grid will update accordingly.

To increase the accuracy of the prompt processing, the user should provide example values for the available columns.
This can be done in following ways.

:::info
Prompt demos use a utility function `mockPromptResolver` to simulate the api that resolves the user prompts.
In a real-world scenario, you should replace this with your own api.

`mockPromptResolver` can handle a predefined set of prompts:

- `sort by name`
- `sort by company name and employee name`
- `show people from the EU`
- `order companies by amount of people`

  :::

## Custom examples

The user can provide custom examples for the prompt processing through the `unstable_examples` prop of the column in the `columns` array.
The `unstable_examples` prop should be an array of values that are possible values for that column.

{{"demo": "PromptWithExamples.js", "bg": "inline"}}

## Use row data for examples

If you pass `allowDataSampling` flag to the `Unstable_GridToolbarPromptControl`, it uses the row data to generate examples for the prompt processing.
This is useful if you are dealing with non-sensitive data and want to skip creating custom examples for each column.

{{"demo": "PromptWithDataSampling.js", "bg": "inline"}}

## Using Server-side data

An example of combining prompt toolbar with the [Server-side data](/x/react-data-grid/server-side-data/)

{{"demo": "PromptWithDataSource.js", "bg": "inline"}}

## Integration with MUI's API

To integrate with MUI's API, an API key would be needed.
As the key cannot be exposed to the client, a small proxy server could be used that would receive prompt processing requests, add the `x-api-key` header, and pass the request further to the MUI's API.

This is an example of a Fastify proxy for the prompt requests

```ts
fastify.register(proxy, {
  upstream: process.env.MUI_DATAGRID_API_URL,
  prefix: '/api/datagrid/prompt',
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

function processPrompt(context: string, query: string) {
  const extendedContext = `The rows represent: List of employees with their company, position and start date\n\n${context}`;

  return unstable_gridDefaultPromptResolver(
    `${PROMPT_RESOLVER_PROXY_BASE_URL}/api/datagrid/prompt`,
    extendedContext,
    query,
  );
}
```
